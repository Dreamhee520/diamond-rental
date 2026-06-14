const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { queryAll, queryOne, execute } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// --- Image Upload Setup ---
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'client', 'public', 'images', 'characters');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, '_')
      .slice(0, 40);
    const timestamp = Date.now();
    cb(null, `${timestamp}_${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG/PNG/WebP/GIF/BMP/SVG 格式'));
    }
  }
});

router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalUsers = queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const totalOrders = queryOne('SELECT COUNT(*) as count FROM orders');
    const totalCharacters = queryOne("SELECT COUNT(*) as count FROM characters WHERE status = 'active'");
    const totalRevenue = queryOne("SELECT SUM(total_price) as total FROM orders WHERE status = 'completed'");

    const recentOrders = queryAll(`
      SELECT orders.*, users.username, characters.name as character_name
      FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN characters ON orders.character_id = characters.id
      ORDER BY orders.created_at DESC LIMIT 10
    `);

    const ordersByStatus = queryAll('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const monthlyRevenue = queryAll(`
      SELECT strftime('%Y-%m', created_at) as month, SUM(total_price) as revenue
      FROM orders WHERE status = 'completed' AND created_at >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', created_at) ORDER BY month DESC
    `);

    res.json({
      success: true,
      data: {
        stats: { totalUsers: totalUsers.count, totalOrders: totalOrders.count, totalCharacters: totalCharacters.count, totalRevenue: totalRevenue.total || 0 },
        recentOrders, ordersByStatus, monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/orders', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let whereClause = '';
    const params = [];
    if (status) { whereClause = 'WHERE orders.status = ?'; params.push(status); }

    const orders = queryAll(`
      SELECT orders.*, users.username, users.email, users.phone, characters.name as character_name, characters.avatar as character_avatar
      FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN characters ON orders.character_id = characters.id
      ${whereClause} ORDER BY orders.created_at DESC LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const totalResult = status
      ? queryOne('SELECT COUNT(*) as total FROM orders WHERE status = ?', [status])
      : queryOne('SELECT COUNT(*) as total FROM orders');

    res.json({ success: true, data: { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total: totalResult.total } } });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const users = queryAll('SELECT id, username, email, phone, role, avatar, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);
    const total = queryOne('SELECT COUNT(*) as total FROM users');
    res.json({ success: true, data: { users, pagination: { page: parseInt(page), limit: parseInt(limit), total: total.total } } });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/characters', authenticateToken, requireAdmin, (req, res) => {
  try {
    const chars = queryAll('SELECT * FROM characters ORDER BY id');
    const parsed = chars.map(c => ({
      ...c,
      personality_tags: JSON.parse(c.personality_tags || '[]'),
      skills: JSON.parse(c.skills || '[]'),
      available_hours: JSON.parse(c.available_hours || '[]')
    }));
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Get admin characters error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, notes } = req.body;
    if (!queryOne('SELECT * FROM orders WHERE id = ?', [orderId])) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    execute('UPDATE orders SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?', [status, notes, orderId]);
    const updated = queryOne(`
      SELECT orders.*, users.username, characters.name as character_name
      FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN characters ON orders.character_id = characters.id WHERE orders.id = ?
    `, [orderId]);
    res.json({ success: true, data: updated, message: '订单更新成功' });
  } catch (error) {
    console.error('Update admin order error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// --- Image Upload ---
router.post('/upload', authenticateToken, requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: '文件大小不能超过 10MB' });
        }
        return res.status(400).json({ success: false, message: `上传错误: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请选择要上传的图片' });
    }
    const url = `/images/characters/${req.file.filename}`;
    res.json({ success: true, data: { url, filename: req.file.filename, size: req.file.size } });
  });
});

module.exports = router;

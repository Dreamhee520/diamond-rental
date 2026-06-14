const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
  try {
    const chars = queryAll("SELECT * FROM characters WHERE status = 'active' ORDER BY rating DESC");
    const parsed = chars.map(c => ({
      ...c,
      personality_tags: JSON.parse(c.personality_tags || '[]'),
      skills: JSON.parse(c.skills || '[]'),
      available_hours: JSON.parse(c.available_hours || '[]')
    }));
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const c = queryOne('SELECT * FROM characters WHERE id = ?', [req.params.id]);
    if (!c) return res.status(404).json({ success: false, message: '角色不存在' });
    const parsed = { ...c, personality_tags: JSON.parse(c.personality_tags || '[]'), skills: JSON.parse(c.skills || '[]'), available_hours: JSON.parse(c.available_hours || '[]') };
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, name_jp, role_tag, description, personality_tags, skills, price_per_hour, price_per_day, avatar, full_body, banner, available_hours, rating } = req.body;
    if (!name || !price_per_hour) return res.status(400).json({ success: false, message: '角色名称和每小时价格不能为空' });

    const result = execute(
      'INSERT INTO characters (name, name_jp, role_tag, description, personality_tags, skills, price_per_hour, price_per_day, avatar, full_body, banner, available_hours, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, name_jp || null, role_tag || null, description || null, JSON.stringify(personality_tags || []), JSON.stringify(skills || []), price_per_hour, price_per_day || null, avatar || null, full_body || null, banner || null, JSON.stringify(available_hours || []), rating || 5.0, 'active']
    );

    const newChar = queryOne('SELECT * FROM characters WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: newChar, message: '角色添加成功' });
  } catch (error) {
    console.error('Add character error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, name_jp, role_tag, description, personality_tags, skills, price_per_hour, price_per_day, avatar, full_body, banner, available_hours, rating, status } = req.body;
    const charId = req.params.id;
    if (!queryOne('SELECT * FROM characters WHERE id = ?', [charId])) {
      return res.status(404).json({ success: false, message: '角色不存在' });
    }

    execute(
      'UPDATE characters SET name = COALESCE(?, name), name_jp = COALESCE(?, name_jp), role_tag = COALESCE(?, role_tag), description = COALESCE(?, description), personality_tags = COALESCE(?, personality_tags), skills = COALESCE(?, skills), price_per_hour = COALESCE(?, price_per_hour), price_per_day = COALESCE(?, price_per_day), avatar = COALESCE(?, avatar), full_body = COALESCE(?, full_body), banner = COALESCE(?, banner), available_hours = COALESCE(?, available_hours), rating = COALESCE(?, rating), status = COALESCE(?, status) WHERE id = ?',
      [name, name_jp, role_tag, description, personality_tags ? JSON.stringify(personality_tags) : null, skills ? JSON.stringify(skills) : null, price_per_hour, price_per_day, avatar, full_body, banner, available_hours ? JSON.stringify(available_hours) : null, rating, status, charId]
    );

    const updated = queryOne('SELECT * FROM characters WHERE id = ?', [charId]);
    res.json({ success: true, data: updated, message: '角色更新成功' });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const charId = req.params.id;
    if (!queryOne('SELECT * FROM characters WHERE id = ?', [charId])) {
      return res.status(404).json({ success: false, message: '角色不存在' });
    }
    execute("UPDATE characters SET status = 'inactive' WHERE id = ?", [charId]);
    res.json({ success: true, message: '角色删除成功' });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;

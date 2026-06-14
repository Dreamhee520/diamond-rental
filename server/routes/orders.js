const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

function checkTimeSlotAvailability(characterId, date, timeSlot, duration, excludeOrderId = null) {
  const character = queryOne('SELECT available_hours FROM characters WHERE id = ?', [characterId]);
  if (!character) return { available: false, message: '角色不存在' };

  const availableHours = JSON.parse(character.available_hours || '[]');
  const requestedStart = timeSlot.split('-')[0];
  const isWithin = availableHours.some(range => {
    const [start, end] = range.split('-');
    return requestedStart >= start && requestedStart < end;
  });

  if (!isWithin) return { available: false, message: '该时间段不在角色可服务时间内' };

  let sql = `SELECT * FROM orders WHERE character_id = ? AND date = ? AND time_slot = ? AND status IN ('pending', 'confirmed', 'ongoing')`;
  const params = [characterId, date, timeSlot];
  if (excludeOrderId) { sql += ' AND id != ?'; params.push(excludeOrderId); }

  const conflicting = queryAll(sql, params);
  if (conflicting.length > 0) return { available: false, message: '该时间段已被预约' };

  return { available: true, message: '时间段可用' };
}

router.post('/', authenticateToken, (req, res) => {
  try {
    const { character_id, service_id, date, time_slot, duration, customer_name, customer_phone, notes } = req.body;
    if (!character_id || !date || !time_slot) return res.status(400).json({ success: false, message: '角色ID、日期和时间段不能为空' });

    const character = queryOne("SELECT * FROM characters WHERE id = ? AND status = 'active'", [character_id]);
    if (!character) return res.status(404).json({ success: false, message: '角色不存在或不可用' });

    const availability = checkTimeSlotAvailability(character_id, date, time_slot, duration || 2);
    if (!availability.available) return res.status(400).json({ success: false, message: availability.message });

    const orderDuration = duration || 2;
    const totalPrice = character.price_per_hour * orderDuration;

    const result = execute(
      'INSERT INTO orders (user_id, character_id, service_id, date, time_slot, duration, total_price, status, customer_name, customer_phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, character_id, service_id || null, date, time_slot, orderDuration, totalPrice, 'pending', customer_name || null, customer_phone || null, notes || null]
    );

    const order = queryOne(`
      SELECT orders.*, users.username, characters.name as character_name, characters.avatar as character_avatar
      FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN characters ON orders.character_id = characters.id WHERE orders.id = ?
    `, [result.lastID]);

    res.status(201).json({ success: true, data: order, message: '订单创建成功' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/', authenticateToken, (req, res) => {
  try {
    const orders = queryAll(`
      SELECT orders.*, characters.name as character_name, characters.avatar as character_avatar, characters.name_jp as character_name_jp
      FROM orders LEFT JOIN characters ON orders.character_id = characters.id WHERE orders.user_id = ? ORDER BY orders.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/check-availability', authenticateToken, (req, res) => {
  try {
    const { character_id, date, time_slot } = req.query;
    if (!character_id || !date || !time_slot) return res.status(400).json({ success: false, message: '角色ID、日期和时间段不能为空' });
    const availability = checkTimeSlotAvailability(parseInt(character_id), date, time_slot, 2);
    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = queryOne(`
      SELECT orders.*, users.username, users.email as user_email, users.phone as user_phone, characters.name as character_name, characters.name_jp as character_name_jp, characters.avatar as character_avatar, characters.role_tag as character_role_tag
      FROM orders LEFT JOIN users ON orders.user_id = users.id LEFT JOIN characters ON orders.character_id = characters.id WHERE orders.id = ?
    `, [req.params.id]);

    if (!order) return res.status(404).json({ success: false, message: '订单不存在' });
    if (order.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: '无权查看此订单' });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const validStatuses = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: '无效的状态' });

    const order = queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) return res.status(404).json({ success: false, message: '订单不存在' });
    if (order.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: '无权修改此订单' });
    if (req.user.role !== 'admin' && status !== 'cancelled') return res.status(403).json({ success: false, message: '普通用户只能取消订单' });

    execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    const updated = queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.json({ success: true, data: updated, message: '订单状态更新成功' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;

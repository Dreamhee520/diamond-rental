const express = require('express');
const router = express.Router();
const { queryAll, queryOne } = require('../db/database');

router.get('/', (req, res) => {
  try {
    const services = queryAll('SELECT * FROM services ORDER BY base_price ASC');
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const service = queryOne('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!service) return res.status(404).json({ success: false, message: '服务不存在' });
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;

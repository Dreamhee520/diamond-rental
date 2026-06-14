const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryOne, execute } = require('../db/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

router.post('/register', (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    if (password.length < 6) return res.status(400).json({ success: false, message: '密码长度至少6位' });

    if (queryOne('SELECT * FROM users WHERE username = ?', [username])) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = execute(
      'INSERT INTO users (username, password, email, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, email || null, phone || null, 'user', '/images/avatars/default.png']
    );

    const newUser = queryOne('SELECT * FROM users WHERE id = ?', [result.lastID]);
    delete newUser.password;
    res.status(201).json({ success: true, data: newUser, message: '注册成功' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: '用户名和密码不能为空' });

    const user = queryOne('SELECT * FROM users WHERE username = ?', [username]);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    res.json({ success: true, data: { user, token }, message: '登录成功' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = queryOne('SELECT id, username, email, phone, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { email, phone, avatar } = req.body;
    execute('UPDATE users SET email = COALESCE(?, email), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar) WHERE id = ?', [email, phone, avatar, req.user.id]);
    const user = queryOne('SELECT id, username, email, phone, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, data: user, message: '资料更新成功' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;

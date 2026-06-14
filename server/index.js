const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, createDefaultAdmin, getDb, saveDatabase } = require('./db/database');

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Diamond Rental API is running', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: '服务器内部错误', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

async function startServer() {
  try {
    await initializeDatabase();
    createDefaultAdmin();

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(' Diamond Rental Girlfriend Agency');
      console.log(' Backend API Server');
      console.log('=================================');
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('');
      console.log('Available endpoints:');
      console.log('  POST   /api/auth/register');
      console.log('  POST   /api/auth/login');
      console.log('  GET    /api/auth/profile');
      console.log('  PUT    /api/auth/profile');
      console.log('  GET    /api/characters');
      console.log('  GET    /api/characters/:id');
      console.log('  POST   /api/characters (admin)');
      console.log('  PUT    /api/characters/:id (admin)');
      console.log('  DELETE /api/characters/:id (admin)');
      console.log('  GET    /api/services');
      console.log('  POST   /api/orders');
      console.log('  GET    /api/orders');
      console.log('  GET    /api/orders/:id');
      console.log('  PUT    /api/orders/:id/status');
      console.log('  GET    /api/orders/check-availability');
      console.log('  GET    /api/admin/dashboard (admin)');
      console.log('  GET    /api/admin/orders (admin)');
      console.log('  GET    /api/admin/users (admin)');
      console.log('  PUT    /api/admin/orders/:id (admin)');
      console.log('');
      console.log('Default admin: admin / admin123');
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  const db = getDb();
  if (db) { saveDatabase(); db.close(); }
  process.exit(0);
});

startServer();
module.exports = app;

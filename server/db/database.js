const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
let db = null;

function initializeDatabase() {
  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('encoding = "UTF-8"');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_jp TEXT,
      role_tag TEXT,
      description TEXT,
      personality_tags TEXT,
      skills TEXT,
      price_per_hour REAL,
      price_per_day REAL,
      avatar TEXT,
      full_body TEXT,
      banner TEXT,
      available_hours TEXT,
      rating REAL DEFAULT 5.0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      base_price REAL,
      duration TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      service_id INTEGER,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      duration INTEGER DEFAULT 2,
      total_price REAL,
      status TEXT DEFAULT 'pending',
      customer_name TEXT,
      customer_phone TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      character_id INTEGER,
      order_id INTEGER,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (character_id) REFERENCES characters(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  console.log('Database initialized successfully');
  return db;
}

function createDefaultAdmin() {
  const existing = queryOne("SELECT * FROM users WHERE username = 'admin'");
  if (!existing) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (username, password, email, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?)'
    ).run('admin', hashedPassword, 'admin@diamond-rental.com', '13800138000', 'admin', '/images/avatars/admin.png');
    console.log('Default admin account created');
  }
}

function queryAll(sql, params = []) {
  return db.prepare(sql).all(...(Array.isArray(params) ? params : [params]));
}

function queryOne(sql, params = []) {
  return db.prepare(sql).get(...(Array.isArray(params) ? params : [params])) || null;
}

function execute(sql, params = []) {
  const result = db.prepare(sql).run(...(Array.isArray(params) ? params : [params]));
  return { lastID: result.lastInsertRowid, changes: result.changes };
}

function saveDatabase() {
  // better-sqlite3 writes to disk immediately; WAL checkpoint for safety
  if (db) {
    db.pragma('wal_checkpoint(TRUNCATE)');
  }
}

function getDb() {
  return db;
}

module.exports = {
  initializeDatabase,
  createDefaultAdmin,
  saveDatabase,
  queryAll,
  queryOne,
  execute,
  getDb
};

// src/config/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Using memory for easy testing, use a filename for persistence

db.serialize(() => {
  // Roles: ADMIN, ANALYST, VIEWER
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    role TEXT,
    status TEXT DEFAULT 'active'
  )`);

  db.run(`CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    type TEXT, -- 'income' or 'expense'
    category TEXT,
    date TEXT,
    description TEXT
  )`);

  // Seed default Admin
  db.run(`INSERT INTO users (username, role) VALUES ('admin_user', 'ADMIN')`);
});

module.exports = db;
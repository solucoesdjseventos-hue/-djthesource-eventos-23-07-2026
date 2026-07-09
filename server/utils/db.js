const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../data/djthe_source.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      clientName TEXT,
      clientEmail TEXT,
      clientPhone TEXT,
      organizerEmail TEXT,
      quoteText TEXT,
      createdAt TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      createdAt TEXT
    )
  `);
});

function addQuoteRow(row) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO quotes (id, clientName, clientEmail, clientPhone, organizerEmail, quoteText, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(row.id, row.clientName, row.clientEmail, row.clientPhone, row.organizerEmail, row.quoteText, row.createdAt, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID });
    });
    stmt.finalize();
  });
}

function getAllQuotes() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, clientName, clientEmail, clientPhone, organizerEmail, quoteText, createdAt FROM quotes ORDER BY createdAt DESC`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function deleteQuote(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM quotes WHERE id = ?`, id, function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

function addClient(client) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO clients (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(client.id, client.name, client.email, client.password, client.createdAt, function (err) {
      if (err) return reject(err);
      resolve(client);
    });
    stmt.finalize();
  });
}

function getClientByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, name, email, password, createdAt FROM clients WHERE email = ?`, email, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { addQuoteRow, getAllQuotes, deleteQuote, addClient, getClientByEmail };

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// DB Path
const dbPath =
  process.env.NODE_ENV === "production"
    ? "/data/database.sqlite"
    : path.join(__dirname, "database.sqlite");

const db = new Database(dbPath);

// ================== INIT DB ==================
db.prepare(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS page_content (
    section_key TEXT PRIMARY KEY,
    content_value TEXT
  )
`).run();

// Seed admin
const admin = db.prepare(
  `SELECT * FROM admin_users WHERE email = ?`
).get('admin@gmail.com');

if (!admin) {
  db.prepare(
    `INSERT INTO admin_users (email, password) VALUES (?, ?)`
  ).run('admin@gmail.com', '1234');
}

// Default content
const defaultContent = {
  hero: JSON.stringify({
    title: "INFINITY",
    subtitle: "THINKING OF A FANTASTIC VICINITY?",
    priceTags: [
      { type: "SMART 2 BHK & GUEST RM", price: "₹ 69.99 Lacs*" },
      { type: "PREMIUM 2 BHK & GUEST RM", price: "₹ 99.99 Lacs*" }
    ],
    location: "Bhosari, PCMC"
  }),
  about: JSON.stringify({
    title: "About Project",
    paragraphs: [
      "Welcome to the extraordinary lifestyle of Infinity!",
      "Infinity captures the essence of elegant living."
    ]
  })
};

Object.entries(defaultContent).forEach(([key, value]) => {
  const row = db.prepare(
    `SELECT * FROM page_content WHERE section_key = ?`
  ).get(key);

  if (!row) {
    db.prepare(
      `INSERT INTO page_content (section_key, content_value) VALUES (?, ?)`
    ).run(key, value);
  }
});

// ================== ROUTES ==================

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const row = db.prepare(
    `SELECT * FROM admin_users WHERE email = ? AND password = ?`
  ).get(email, password);

  if (row) {
    res.json({ message: "Login successful", token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Get content
app.get('/api/content', (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM page_content`).all();

    const content = {};
    rows.forEach(row => {
      try {
        content[row.section_key] = JSON.parse(row.content_value);
      } catch {
        content[row.section_key] = row.content_value;
      }
    });

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  }
});

// Update content
app.post('/api/content', (req, res) => {
  const { token, section_key, content_value } = req.body;

  if (token !== "fake-jwt-token") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const valueString =
      typeof content_value === "object"
        ? JSON.stringify(content_value)
        : content_value;

    db.prepare(
      `UPDATE page_content SET content_value = ? WHERE section_key = ?`
    ).run(valueString, section_key);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// ================== SERVER ==================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
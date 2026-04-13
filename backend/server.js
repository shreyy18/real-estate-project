const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize DB schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS page_content (
    section_key TEXT PRIMARY KEY,
    content_value TEXT
  )`);

  // Seed Admin User
  db.get(`SELECT * FROM admin_users WHERE email = ?`, ['admin@gmail.com'], (err, row) => {
    if (!row) {
      db.run(`INSERT INTO admin_users (email, password) VALUES (?, ?)`, ['admin@gmail.com', '1234']);
    }
  });

  // Seed default content from image
  const defaultContent = {
    hero: JSON.stringify({
      title: "INFINITY",
      subtitle: "THINKING OF A FANTASTIC VICINITY?",
      priceTags: [{ type: "SMART 2 BHK & GUEST RM", price: "₹ 69.99 Lacs*" }, { type: "PREMIUM 2 BHK & GUEST RM", price: "₹ 99.99 Lacs*" }],
      location: "Bhosari, PCMC"
    }),
    about: JSON.stringify({
      title: "About Project",
      paragraphs: [
        "Welcome to the extraordinary lifestyle of Infinity! Inspired by the concept of boundlessness, Infinity brings an array of amenities that transcend the ordinary. Impeccably designed spaces allow you to experience life's true colors.",
        "Infinity captures the essence of elegant living, crafting spaces that speak the language of sophistication. Live limitless, dream infinite!"
      ]
    }),
    amenities: JSON.stringify([
      { icon: "Gym", title: "Gymnasium" },
      { icon: "Pool", title: "Infinity Pool" },
      { icon: "Jogging", title: "Jogging Track" },
      { icon: "Yoga", title: "Yoga Area" },
      { icon: "Park", title: "Kids Play Area" }
    ]),
    constructionUpdates: JSON.stringify([
      { label: "Phase 1 - Under Construction" },
      { label: "Phase 2 - Planned" }
    ]),
    faq: JSON.stringify([
      { question: "What is the starting price?", answer: "The starting price is ₹ 69.99 Lacs*." },
      { question: "Where is the location?", answer: "Bhosari, PCMC." }
    ])
  };

  Object.entries(defaultContent).forEach(([key, value]) => {
    db.get(`SELECT * FROM page_content WHERE section_key = ?`, [key], (err, row) => {
      if (!row) {
        db.run(`INSERT INTO page_content (section_key, content_value) VALUES (?, ?)`, [key, value]);
      }
    });
  });
});

// Admin Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });
  
  db.get(`SELECT * FROM admin_users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (row) {
      res.json({ message: "Login successful", token: "fake-jwt-token" }); // Simple token for demo
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Get Content
app.get('/api/content', (req, res) => {
  db.all(`SELECT * FROM page_content`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    const content = {};
    rows.forEach(row => {
      try {
        content[row.section_key] = JSON.parse(row.content_value);
      } catch (e) {
        content[row.section_key] = row.content_value;
      }
    });
    res.json(content);
  });
});

// Update Content (protected)
app.post('/api/content', (req, res) => {
  const { token, section_key, content_value } = req.body;
  if (token !== "fake-jwt-token") return res.status(403).json({ error: "Unauthorized" });

  const valueString = typeof content_value === 'object' ? JSON.stringify(content_value) : content_value;
  db.run(`UPDATE page_content SET content_value = ? WHERE section_key = ?`, [valueString, section_key], function(err) {
    if (err) return res.status(500).json({ error: "Failed to update" });
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

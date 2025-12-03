const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, '..', 'data', 'wishes.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run(`
      CREATE TABLE IF NOT EXISTS wishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_name TEXT NOT NULL,
        to_name TEXT,
        message TEXT,
        background_theme TEXT DEFAULT 'snow',
        greeting_style TEXT DEFAULT 'standard',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        share_count INTEGER DEFAULT 0
      )
    `);
  }
});

// Routes

// API: Create a new wish
app.post('/api/wishes', (req, res) => {
  const { from_name, to_name, message, background_theme, greeting_style } = req.body;

  const stmt = db.prepare(`
    INSERT INTO wishes (from_name, to_name, message, background_theme, greeting_style)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run([from_name, to_name || '', message || '', background_theme || 'snow', greeting_style || 'standard'], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to create wish' });
    } else {
      res.json({ 
        id: this.lastID,
        link: `${process.env.URL || 'http://localhost:3000'}/wish?from=${encodeURIComponent(from_name)}&id=${this.lastID}`
      });
    }
  });
  stmt.finalize();
});

// API: Get wish details
app.get('/api/wishes/:from_name', (req, res) => {
  const from_name = req.params.from_name;
  
  db.all(
    'SELECT * FROM wishes WHERE from_name = ? ORDER BY timestamp DESC LIMIT 1',
    [from_name],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch wish' });
      } else if (rows && rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'Wish not found' });
      }
    }
  );
});

// API: Get wish by ID
app.get('/api/wishes/id/:id', (req, res) => {
  const id = req.params.id;
  
  db.get(
    'SELECT * FROM wishes WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch wish' });
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'Wish not found' });
      }
    }
  );
});

// API: Update share count
app.post('/api/wishes/:id/share', (req, res) => {
  const id = req.params.id;
  
  db.run(
    'UPDATE wishes SET share_count = share_count + 1 WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to update share count' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

module.exports = app;
module.exports.handler = serverless(app);

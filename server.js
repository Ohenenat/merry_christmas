const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory');
}

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'data', 'wishes.db'), (err) => {
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

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Wish page
app.get('/wish', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wish.html'));
});

// API: Create a new wish
app.post('/api/wishes', (req, res) => {
  const { from_name, background_theme, greeting_style } = req.body;

  const stmt = db.prepare(`
    INSERT INTO wishes (from_name, background_theme, greeting_style)
    VALUES (?, ?, ?)
  `);

  stmt.run([from_name, background_theme || 'snow', greeting_style || 'standard'], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to create wish' });
    } else {
      res.json({ 
        id: this.lastID,
        link: `${req.get('host').startsWith('localhost') ? 'http' : 'https'}://${req.get('host')}/wish?id=${this.lastID}`
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

// API: Get all wishes (Admin view)
app.get('/api/all-wishes', (req, res) => {
  db.all(
    'SELECT id, from_name, background_theme, timestamp, share_count FROM wishes ORDER BY timestamp DESC',
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch wishes' });
      } else {
        res.json({
          total: rows ? rows.length : 0,
          wishes: rows || []
        });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🎄 Christmas Wish App running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

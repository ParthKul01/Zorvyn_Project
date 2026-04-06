// src/routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authorize } = require('../middleware/auth');
const { getSummary } = require('../services/financeService');

// 1. Create Record (Admin only)
router.post('/records', authorize('create_record'), (req, res) => {
  const { amount, type, category, date, description } = req.body;
  if (!amount || !type) return res.status(400).json({ error: "Missing required fields" });

  db.run(`INSERT INTO records (amount, type, category, date, description) VALUES (?, ?, ?, ?, ?)`,
    [amount, type, category, date, description], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// 2. View Records (All roles)
router.get('/records', authorize('view_all'), (req, res) => {
  db.all(`SELECT * FROM records`, [], (err, rows) => {
    res.json(rows);
  });
});

// 3. Dashboard Summary (Analyst and Admin)
router.get('/summary', authorize('view_insights'), async (req, res) => {
  try {
    const data = await getSummary();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
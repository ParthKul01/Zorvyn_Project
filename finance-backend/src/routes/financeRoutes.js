// src/routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const { connectDB } = require('../config/database');
const { authorize } = require('../middleware/auth');
const { getSummary } = require('../services/financeService');

// 1. Create Record (Admin only)
router.post('/records', authorize('create_record'), async (req, res) => {
  const { amount, type, category, date, description } = req.body;
  if (!amount || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await connectDB();
    const records = db.collection('records');
    const result = await records.insertOne({
      amount,
      type,
      category: category || null,
      date: date || new Date().toISOString(),
      description: description || null,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. View Records (All roles)
router.get('/records', authorize('view_all'), async (req, res) => {
  try {
    const db = await connectDB();
    const records = db.collection('records');
    const rows = await records.find({}).toArray();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
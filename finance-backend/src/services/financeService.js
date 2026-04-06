// src/services/financeService.js
const db = require('../config/database');

const getSummary = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses,
        category,
        COUNT(*) as count
      FROM records GROUP BY category
    `;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      
      const summary = {
        totalIncome: rows.reduce((a, b) => a + (b.totalIncome || 0), 0),
        totalExpenses: rows.reduce((a, b) => a + (b.totalExpenses || 0), 0),
        categoryBreakdown: rows.map(r => ({ category: r.category, total: r.totalIncome || r.totalExpenses }))
      };
      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      resolve(summary);
    });
  });
};

module.exports = { getSummary };
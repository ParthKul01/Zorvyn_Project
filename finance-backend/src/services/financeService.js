// src/services/financeService.js
const { connectDB } = require('../config/database');

const getSummary = async () => {
  const db = await connectDB();
  const records = db.collection('records');

  const pipeline = [
    {
      $group: {
        _id: '$category',
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
          },
        },
        count: { $sum: 1 },
      },
    },
  ];

  const rows = await records.aggregate(pipeline).toArray();

  const summary = {
    totalIncome: rows.reduce((a, b) => a + (b.totalIncome || 0), 0),
    totalExpenses: rows.reduce((a, b) => a + (b.totalExpenses || 0), 0),
    categoryBreakdown: rows.map((r) => ({
      category: r._id,
      total: (r.totalIncome || 0) + (r.totalExpenses || 0),
      count: r.count,
    })),
  };

  summary.netBalance = summary.totalIncome - summary.totalExpenses;
  return summary;
};

module.exports = { getSummary };
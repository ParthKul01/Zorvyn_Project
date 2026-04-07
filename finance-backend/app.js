// app.js
require('dotenv').config();
const express = require('express');
const financeRoutes = require('./src/routes/financeRoutes');
const { connectDB } = require('./src/config/database');

const app = express();
app.use(express.json());

// Routes
app.use('/api', financeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Finance Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
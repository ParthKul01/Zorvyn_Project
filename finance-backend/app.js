// app.js
const express = require('express');
const financeRoutes = require('./src/routes/financeRoutes');

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
app.listen(PORT, () => {
  console.log(`Finance Backend running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/laws', require('./routes/laws'));
app.use('/api/simulator', require('./routes/simulator'));
app.use('/api/chat', require('./routes/chat'));

// MongoDB connection (mock or actual)
// Note: Normally we'd use mongoose.connect('mongodb://127.0.0.1:27017/shadowroad') here.
// To ensure it runs even without a DB immediately, we'll log it conditionally.
mongoose.connect('mongodb://127.0.0.1:27017/shadowroad')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error (check if mongo is running): ', err.message));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

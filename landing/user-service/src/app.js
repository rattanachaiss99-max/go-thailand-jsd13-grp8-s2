const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS configuration: Allow frontend apps to connect
const allowedOrigins = (process.env.CLIENT_URL || '*').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    credentials: true
  })
);

app.use(express.json());

// Health check endpoint (Essential for Render / Cloud monitoring)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'gt-user-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

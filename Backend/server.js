const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRouter = require('./routes/auth');
const resumeRouter = require('./routes/resume');

const app = express();
const port = process.env.PORT || 5000;

// CORS options
const cors = require("cors");

const allowedOrigins = [
  "https://resume-frontend-xi.vercel.app" // ✅ Add your frontend URL here
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));



app.use(express.json()); // Use express.json() for parsing JSON bodies

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routers
app.use('/api/auth', authRouter);
app.use('/api', resumeRouter);

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

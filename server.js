require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const videosRouter = require('./routes/videos');
const youtubeRouter = require('./routes/youtube');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from public/
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/videos', videosRouter);
app.use('/api/youtube', youtubeRouter);

// Root & SPA Fallback: Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 VidFlow Server running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`========================================`);
});

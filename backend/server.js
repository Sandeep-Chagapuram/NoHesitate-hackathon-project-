const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/questionflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const sessionRoutes = require('./routes/session.routes');
const doubtRoutes = require('./routes/doubt.routes');
const confusionRoutes = require('./routes/confusion.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/api/sessions', sessionRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/confusion', confusionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

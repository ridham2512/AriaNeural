// =============================================
// server.js — Main Entry Point
// =============================================
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// ── Allowed Origins ──────────────────────────
// This allows both your local computer AND your Vercel deployment to talk to the backend.
const allowedOrigins = [
  'http://localhost:5173',
  'https://aria-neural-5z89.vercel.app',
  process.env.CLIENT_URL // Keeps your env variable option open just in case
];

// ── Socket.IO setup ──────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Make io accessible in controllers via req.io
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// ── Middleware ───────────────────────────────
// Update CORS to accept the Vercel URL
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

// ── Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── Error Handler (must be last) ─────────────
app.use(errorHandler);

// ── Socket.IO Events ─────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ── Start Server ─────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

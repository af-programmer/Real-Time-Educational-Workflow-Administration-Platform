require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io namespace for real-time notifications
const notifNS = io.of('/notifications');

notifNS.on('connection', (socket) => {
  const { userId, role, isHomeroom } = socket.handshake.auth;

  if (userId) {
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);
    if (role === 'teacher') {
      socket.join(isHomeroom ? 'role:homeroom_teacher' : 'role:professional_teacher');
    }
  }

  socket.on('disconnect', () => {});
});

// Make io accessible in controllers via app.locals
app.locals.io = io;
app.locals.notifNS = notifNS;

async function start() {
  await testConnection();
  server.listen(PORT, () => {
    console.log(`\n🚀 EduFlow API running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

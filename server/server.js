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

const notifNS = io.of('/notifications');

notifNS.on('connection', (socket) => {
  const { userId, role } = socket.handshake.auth;

  if (userId) {
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);
    if (role === 'teacher') {
      socket.join('role:teacher');
      socket.join('role:professional_teacher');
    } else if (role === 'Educator') {
      socket.join('role:teacher');
      socket.join('role:Educator');
    }
  }

  socket.on('disconnect', () => {});
});

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

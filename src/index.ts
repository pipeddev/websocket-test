import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinGroup', (group: string) => {
    socket.join(group);
    console.log(`${socket.id} joined group ${group}`);
  });

  socket.on('leaveGroup', (group: string) => {
    socket.leave(group);
    console.log(`${socket.id} left group ${group}`);
  });

  socket.on('sendNotification', ({ group, message }) => {
    io.to(group).emit('notification', message);
    console.log(`Notification sent to group ${group}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
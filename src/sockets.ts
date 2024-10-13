import { Server } from 'socket.io';

const sockets = (io: Server) => {
  io.on('connection', socket => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('joinEvent', (eventId: string) => {
      socket.join(eventId);
      console.log(`Socket ${socket.id} se unió al evento ${eventId}`);
      const participants = io.sockets.adapter.rooms.get(eventId)?.size ?? 1;
      io.in(eventId).emit('participants', participants);
    });

    socket.on('updateCurrentVideo', ({ eventId, videoId }: { eventId: string; videoId: string }) => {
      socket.to(eventId).emit('updateCurrentVideo', videoId);
    });

    socket.on('leaveEvent', (eventId: string) => {
      socket.leave(eventId);
      console.log(`Cliente ha salido del evento: ${eventId}`);
      const participants = io.sockets.adapter.rooms.get(eventId)?.size ?? 1;
      io.in(eventId).emit('participants', participants);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};

export default sockets;

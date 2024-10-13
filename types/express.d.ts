import { Server as SocketIOServer } from 'socket.io';

// Extender el tipo Request de Express
declare module 'express-serve-static-core' {
  interface Request {
    io?: SocketIOServer; // Agrega la propiedad io
  }
}

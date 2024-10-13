import { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';

export const addSocketIOMiddleware = (io: SocketIOServer) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };
};

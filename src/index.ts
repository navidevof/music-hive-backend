import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Application } from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import routes from './routes';
import { addSocketIOMiddleware } from './middlewares/socketIo';
import { Server } from 'socket.io';
import sockets from './sockets';

const whitelist = ['https://music-hive.vercel.app', '/'];

const options: cors.CorsOptions = {
  origin: whitelist,
};
const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'production';

const app: Application = express();

app.use(express.json({ limit: '20kb' }));
app.use(helmet());

if (env === 'production') {
  app.use(cors(options));
}

if (env === 'development') {
  app.use(cors());
}

app.disable('x-powered-by');

const server = createServer(app).listen({ port }, () => {
  console.log(`Server started at port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

sockets(io);

app.use(addSocketIOMiddleware(io));

routes(app);

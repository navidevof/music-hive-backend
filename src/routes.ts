import { Application } from 'express';

import eventsRouter from './components/events/network';
import videosRouter from './components/videos/network';

function routes(app: Application) {
  app.use('/events', eventsRouter);
  app.use('/videos', videosRouter);
}

export default routes;

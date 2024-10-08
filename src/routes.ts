import { Application } from 'express';

import videosRouter from './components/videos/network';

function routes(app: Application) {
  app.use('/videos', videosRouter);
}

export default routes;

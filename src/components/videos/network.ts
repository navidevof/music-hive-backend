import { Router } from 'express';

import videosController from './controller';

const router = Router();

router.get('/search', videosController.search);

export default router;

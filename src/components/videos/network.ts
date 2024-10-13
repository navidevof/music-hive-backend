import { Router } from 'express';

import videosController from './controller';

const router = Router();

router.get('/search', videosController.search);
router.patch('/add-video-to-playlist', videosController.addVideoToPlaylist);
router.patch('/remove-video-from-playlist', videosController.removeVideoFromPlaylist);

export default router;

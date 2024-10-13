import { Router } from 'express';

import authorization from '../../middlewares/authorization';
import eventsController from './controller';

const router = Router();
router.get('/:eventId/playlists', eventsController.getPlaylistByEvent);

router.post('/create', authorization, eventsController.createEvent);
router.post('/join', eventsController.joinEvent);
router.post('/leave', eventsController.leaveEvent);

router.patch('/add-video-to-playlist', eventsController.addVideoToPlaylist);

export default router;

import { Router } from 'express';

import authorization from '../../middlewares/authorization';
import eventsController from './controller';

const router = Router();
router.get('/:eventId/playlists', eventsController.getPlaylistByEvent);

router.post('/create', authorization, eventsController.createEvent);
router.post('/join', eventsController.joinEvent);
router.post('/leave', authorization, eventsController.leaveEvent);

export default router;

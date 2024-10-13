import { db } from '../../firebase';
import { IEvent } from '../../interfaces/event';
import { IVideo } from '../../interfaces/video';
import { COLLECTIONS } from '../../utils/constants';

const EventsServices = () => {
  const createEvent = async ({ name, uid, maxParticipants }: { uid: string; name: string; maxParticipants: number }) => {
    const docRef = db.collection(COLLECTIONS.EVENTS).doc();
    const now = Date.now();

    await docRef.set({
      eventId: docRef.id,
      name,
      createdAt: now,
      uid,
      participants: 0,
      maxParticipants,
    });

    return docRef.id;
  };

  const getEvent = async ({ eventId }: { eventId: string }) => {
    const event = await db.collection(COLLECTIONS.EVENTS).doc(eventId).get();

    return event.data() as IEvent;
  };

  const getPlaylistByEvent = async ({ eventId }: { eventId: string }) => {
    const playlist = await db
      .collection(COLLECTIONS.EVENTS)
      .doc(eventId)
      .collection(COLLECTIONS.PLAYLISTS)
      .orderBy('createdAt', 'asc')
      .get();

    return playlist.docs.map(doc => doc.data() as IVideo);
  };

  const removeEvent = async ({ eventId }: { eventId: string }) => {
    await db.recursiveDelete(db.collection(COLLECTIONS.EVENTS).doc(eventId));
  };

  return {
    createEvent,
    getEvent,
    getPlaylistByEvent,
    removeEvent,
  };
};

export default EventsServices;

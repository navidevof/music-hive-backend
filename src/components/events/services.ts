import { db } from '../../firebase';
import { IEvent } from '../../interfaces/event';
import { IVideo } from '../../interfaces/video';
import { COLLECTIONS } from '../../utils/constants';

const EventsServices = () => {
  const createEvent = async ({ name, uid, maxParticipants }: { uid: string; name: string; maxParticipants: number }) => {
    const batch = db.batch();
    const docRef = db.collection(COLLECTIONS.EVENTS).doc();
    const now = Date.now();

    batch.set(docRef, { eventId: docRef.id, name, createdAt: now, uid, maxParticipants });
    batch.set(docRef.collection(COLLECTIONS.PLAYLISTS).doc(COLLECTIONS.PLAYLISTS_FIELD), { videos: [] });

    await batch.commit();

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
      .doc(COLLECTIONS.PLAYLISTS_FIELD)
      .get();

    if (!playlist.exists) {
      return [];
    }

    return playlist.data().videos as IVideo[];
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

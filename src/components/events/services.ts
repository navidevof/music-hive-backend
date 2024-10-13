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

  const addVideoToPlaylist = async ({ eventId, video }: { eventId: string; video: IVideo }) => {
    await db
      .collection(COLLECTIONS.EVENTS)
      .doc(eventId)
      .collection(COLLECTIONS.PLAYLISTS)
      .add({
        ...video,
        createdAt: Date.now(),
      });
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
    const batch = db.batch();

    batch.delete(db.collection(COLLECTIONS.EVENTS).doc(eventId));

    await batch.commit();
  };

  return {
    createEvent,
    getEvent,
    getPlaylistByEvent,
    addVideoToPlaylist,
    removeEvent,
  };
};

export default EventsServices;

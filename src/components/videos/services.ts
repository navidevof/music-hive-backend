import { db } from '../../firebase';
import { ISearchVideo, IVideo } from '../../interfaces/video';
import { COLLECTIONS } from '../../utils/constants';

const VideosService = () => {
  const search = async (q: string) => {
    const YouTube = require('youtube-search-api');

    const res = await YouTube.GetListByKeyword(q, false, 10);

    const data: ISearchVideo[] = res.items.map((item: any) => ({
      videoId: item.id,
      title: item.title,
      image: item.thumbnail?.thumbnails[0]?.url,
    }));

    return data;
  };

  const getVideoById = async ({ videoId, eventId }: { videoId: string; eventId: string }) => {
    const video = await db
      .collection(COLLECTIONS.EVENTS)
      .doc(eventId)
      .collection(COLLECTIONS.PLAYLISTS)
      .doc(COLLECTIONS.PLAYLISTS_FIELD)
      .get();
    if (!video.exists) return null;

    const videos = video.data().videos as IVideo[];
    const videoIndex = videos.findIndex(video => video.videoId === videoId);
    if (videoIndex === -1) return null;

    return videos[videoIndex];
  };

  const addVideoToPlaylist = async ({ eventId, video }: { eventId: string; video: IVideo }) => {
    const playlistRef = db.collection(COLLECTIONS.EVENTS).doc(eventId).collection(COLLECTIONS.PLAYLISTS).doc(COLLECTIONS.PLAYLISTS_FIELD);

    await db.runTransaction(async transaction => {
      const playlist = await transaction.get(playlistRef);

      if (!playlist.exists) {
        throw new Error('Aún no hay una playlist registrada.');
      }

      const videos = playlist.data().videos;
      videos.push(video);
      transaction.set(playlistRef, { videos });
    });
  };

  const removeVideoFromPlaylist = async ({ eventId, videoId }: { eventId: string; videoId: string }) => {
    const playlistRef = db.collection(COLLECTIONS.EVENTS).doc(eventId).collection(COLLECTIONS.PLAYLISTS).doc(COLLECTIONS.PLAYLISTS_FIELD);

    await db.runTransaction(async transaction => {
      const playlist = await transaction.get(playlistRef);

      if (!playlist.exists) {
        throw new Error('Aún no hay una playlist registrada.');
      }

      const videos = playlist.data().videos as IVideo[];
      const currentVideoIdx = videos.findIndex((video: IVideo) => video.videoId === videoId);
      if (currentVideoIdx === -1) throw new Error('El video no existe en la lista de reproducción.');

      videos.splice(currentVideoIdx, 1);
      transaction.set(playlistRef, { videos });
    });
  };

  return {
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getVideoById,
    search,
  };
};

export default VideosService;

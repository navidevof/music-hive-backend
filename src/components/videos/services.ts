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
    const video = await db.collection(COLLECTIONS.EVENTS).doc(eventId).collection(COLLECTIONS.PLAYLISTS).doc(videoId).get();

    if (!video.exists) return null;

    return video.data() as IVideo;
  };

  const addVideoToPlaylist = async ({ eventId, video }: { eventId: string; video: IVideo }) => {
    await db
      .collection(COLLECTIONS.EVENTS)
      .doc(eventId)
      .collection(COLLECTIONS.PLAYLISTS)
      .doc(video.videoId)
      .set({
        ...video,
        createdAt: Date.now(),
      });
  };

  const removeVideoFromPlaylist = async ({ eventId, videoId }: { eventId: string; videoId: string }) => {
    await db.collection(COLLECTIONS.EVENTS).doc(eventId).collection(COLLECTIONS.PLAYLISTS).doc(videoId).delete();
  };

  return {
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getVideoById,
    search,
  };
};

export default VideosService;

import { ISearchVideo } from '../../interfaces/video';

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

  return {
    search,
  };
};

export default VideosService;

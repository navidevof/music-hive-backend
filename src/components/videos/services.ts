import { chromium } from 'playwright';

const VideosService = () => {
  const search = async (q: string) => {
    const browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(`https://www.youtube.com/results?search_query=${q}`);
    const data = (
      await page.$$eval('ytd-video-renderer', results =>
        results.map(el => {
          const poster = el
            .querySelector('#dismissible')
            .querySelector('ytd-thumbnail')
            .querySelector('a')
            .querySelector('yt-image')
            .querySelector('img')
            .getAttribute('src');

          if (!poster) return null;

          const title = el
            .querySelector('div')
            .querySelector('#meta')
            .querySelector('#title-wrapper')
            .querySelector('h3')
            .querySelector('a')
            .text.trim();

          const url =
            'https://www.youtube.com/embed/' +
            el
              .querySelector('div')
              .querySelector('#meta')
              .querySelector('#title-wrapper')
              .querySelector('h3')
              .querySelector('a')
              .getAttribute('href')
              .match(/=(.*?)&/)[1];

          return {
            poster,
            title,
            url,
          };
        })
      )
    ).filter(item => item !== null);

    return data;
  };

  return {
    search,
  };
};

export default VideosService;

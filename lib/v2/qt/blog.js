const cheerio = require('cheerio');
const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const url = 'https://www.qt.io/blog';
    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const item = await Promise.all(
        $('.c-article-list-item').map(async (_, elem) => {
            const date = $('p', elem).text();
            const title = $('h2', elem).text();
            const link = $('a', elem).attr('href');
            const article_response = await got.get(link);
            const $$ = cheerio.load(article_response.data);
            const description = $$('article').html();
            return {
                title,
                link,
                description,
                pubDate: parseDate(date),
            };
        })
    );
    ctx.state.data = {
        title: 'Qt Blog',
        link: url,
        item,
        image: 'https://www.qt.io/hubfs/2016_Qt_Logo/qt_logo_green_rgb_16x16.png',
    };
};

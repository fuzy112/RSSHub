const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const baseURL = `https://www.browserless.io`;
    const url = 'https://www.browserless.io/page-data/blog/page-data.json';
    const response = await got.get(url);

    const items = await Promise.all(
        response.data.result.data.allWpPost.nodes.map(async (elem) => {
            const dataURL = new URL(`https://www.browserless.io/page-data${elem.url}page-data.json`);
            const res = await got.get(dataURL);
            const { title, date, content } = res.data.result.data.wpPost;
            return {
                title,
                link: new URL(elem.url, baseURL),
                description: content,
                pubDate: parseDate(date),
            };
        })
    );

    const { title, description } = response.data.result.data.wpPage.blogFields.hero;
    ctx.state.data = {
        title,
        link: `https://www.browserless.io/blog/`,
        description,
        item: items,
        language: 'en-us',
    };
};

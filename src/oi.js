const fetch = require('node-fetch');

const mediumFeed = 'https://medium.com/feed/@fejori';

const getFeed = async () => {
  const response = await fetch(mediumFeed);
  const json = await response.json();
  return json;
}

const getPosts = async () => {
  const feed = await getFeed();
  const posts = feed.items.map(item => {
    return {
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.content,
      contentSnippet: item.contentSnippet,
      guid: item.guid,
      categories: item.categories,
    }
  });
  return posts;
}

const posts = getPosts().then(posts => {
  console.log(posts);
});

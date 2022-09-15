import fetch from 'node-fetch';
import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

const mediumFeed = 'https://medium.com/feed/@fejori';
const file = 'mediumPosts.md';

const getXmlFeed = async () => {
  const response = await fetch(mediumFeed);
  const feed = await response.text();
  return feed;
}

const getPosts = async () => {
  const feed = await getXmlFeed();
  const doc = new DOMParser().parseFromString(feed, 'text/xml')
  const items = doc.getElementsByTagName('item');
  const posts = Array.from(items).map(item => {
    const content = item.getElementsByTagName('content:encoded')[0].textContent;
    return {
      title: item.getElementsByTagName('title')[0].textContent,
      link: item.getElementsByTagName('link')[0].textContent,
      description: content.match(/<p>(.*?)<\/p>|<h3>(.*?)<\/h3>|<h4>(.*?)<\/h4>/)[0].replace(/<\/?[^>]+(>|$)/g, ""),
      image: content.match(/<img.*?src="(.*?)"/)[1],
      pubDate: item.getElementsByTagName('pubDate')[0].textContent,
    }
  });
  return posts;
}

getPosts().then(posts => {
  posts.forEach(post => {
    fs.appendFileSync(file, `### [${post.title}](${post.link})\n`);
    fs.appendFileSync(file, `${post.description}\n\n`);
    fs.appendFileSync(file,`<img align="right" src="${post.image}">`);
  })
});




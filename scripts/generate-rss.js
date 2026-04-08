const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const RSS = require('rss');

const postsDir = path.join(process.cwd(), 'posts');
const outDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const feed = new RSS({
  title: 'SCROLLS',
  site_url: 'https://example.com',
  feed_url: 'https://example.com/rss.xml'
});

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
files.forEach((file) => {
  const full = path.join(postsDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  feed.item({
    title: data.title,
    description: data.excerpt || '',
    url: `https://example.com/posts/${file.replace(/\.md$/, '')}`,
    date: data.date
  });
});

fs.writeFileSync(path.join(outDir, 'rss.xml'), feed.xml({ indent: true }));
console.log('rss.xml generated');

const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

(async function generate() {
  const postsDir = path.join(process.cwd(), 'posts');
  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const links = [
    { url: '/', changefreq: 'daily', priority: 0.9 },
    { url: '/about', changefreq: 'monthly', priority: 0.6 }
  ];

  const files = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((f) => f.endsWith('.md')) : [];
  files.forEach((f) => links.push({ url: `/posts/${f.replace(/\.md$/, '')}`, changefreq: 'monthly', priority: 0.7 }));

  const stream = new SitemapStream({ hostname: 'https://example.com' });
  const xml = await streamToPromise(ReadableFromArray(links).pipe(stream));
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml.toString());
  console.log('sitemap.xml generated');

  function ReadableFromArray(arr) {
    const { Readable } = require('stream');
    const s = new Readable({ objectMode: true });
    arr.forEach((i) => s.push(i));
    s.push(null);
    return s;
  }
})();

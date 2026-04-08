import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostMeta = {
  title: string;
  date: string;
  tags?: string[];
  author?: string;
  excerpt?: string;
  image?: string;
  slug: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const meta: PostMeta = {
    title: data.title || realSlug,
    date: data.date || '',
    tags: data.tags || [],
    author: data.author || 'Author',
    excerpt: data.excerpt || '',
    image: data.image || '/images/golf-placeholder.jpg',
    slug: realSlug
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((fileName) => {
      const { meta } = getPostBySlug(fileName);
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

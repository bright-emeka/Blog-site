import { useMemo, useState } from 'react';
import Head from 'next/head';
import { getAllPosts, PostMeta } from '../lib/posts';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import TagList from '../components/TagList';
import Hero from '../components/Hero';
import PostCard from '../components/PostCard';

const POSTS_PER_PAGE = 9;

export default function Home({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = posts;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      list = list.filter((p) => (p.tags || []).includes(selectedTag));
    }
    return list;
  }, [posts, query, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort();

  // Featured is first post
  const featured = posts[0] || null;

  return (
    <>
      <Head>
        <title>Dough_Lord — SCROLLS</title>
        <meta name="description" content="Golf Scrolls with tips, reviews and news" />
        <meta property="og:title" content="Dough_Lord — SCROLLS" />
        <meta property="og:description" content="Golf Scrolls with tips, reviews and news" />
        <meta property="og:type" content="website" />
      </Head>

      <Hero post={featured} />

      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Search value={query} onChange={setQuery} placeholder="Search posts or tags" />
          <TagList tags={allTags} active={selectedTag} onSelect={setSelectedTag} />
        </div>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Pagination current={page} total={totalPages} onChange={(p: number) => setPage(p)} />
        </div>
      </div>
    </>
  );
}

export function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}

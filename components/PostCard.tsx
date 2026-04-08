import Link from 'next/link';
import { useScrollAnimation } from '../lib/useScrollAnimation';

export default function PostCard({ post }: { post: any }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <article
      ref={ref}
      className={`glass-card card overflow-hidden shadow-sm transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="h-40 sm:h-48 bg-gray-200 dark:bg-zinc-800 bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">{post.date} • {post.author}</div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(post.tags || []).map((t: string) => (
              <span key={t} className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">#{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

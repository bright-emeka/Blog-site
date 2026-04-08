import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPostSlugs } from '../../lib/posts';

export default function PostPage({ meta, content }: { meta: any; content: string }) {
  return (
    <>
      <Head>
        <title>{meta.title} • Imagenda Golf</title>
        <meta name="description" content={meta.excerpt || ''} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt || ''} />
        {meta.image && <meta property="og:image" content={meta.image} />}
      </Head>
      <article>
        {meta.image && (
          <div className="w-full h-64 bg-cover bg-center rounded-lg mb-6" style={{ backgroundImage: `url(${meta.image})` }} />
        )}
        <h1 className="text-3xl font-bold">{meta.title}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">{meta.date} • {meta.author}</div>
        <div className="prose dark:prose-invert mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs().map((s) => s.replace(/\.md$/, ''));
  return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const { meta, content } = getPostBySlug(`${slug}.md`);
  return { props: { meta, content } };
};

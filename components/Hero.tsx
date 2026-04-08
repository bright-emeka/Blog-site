import Link from 'next/link';

export default function Hero({ post }: { post: any }) {
  if (!post) return null;

  const imageStyle = {
    backgroundImage: `url(${post.image || '/assets/images/tree-reflected-lake.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section className="w-full mb-8">
      {/* full-bleed wrapper: centers a viewport-wide block so it stretches edge-to-edge even inside a padded container */}
      <div className="relative left-1/2 right-1/2 -translate-x-1/2 w-screen bg-[#f0f0f0]">
        <div className="flex flex-col md:flex-row min-h-[380px] md:min-h-[480px]">
          {/* Image column */}
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <div className="h-full w-full" style={imageStyle} />
          </div>

          {/* Text column */}
          <div className="w-full md:w-1/2 flex items-center">
            <div className="w-full px-6 py-8 md:py-12 md:pr-12 md:pl-8">
              <div className="max-w-2xl md:ml-auto text-center md:text-right">
                <div className="text-sm uppercase tracking-wide text-gray-600">Featured</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900">{post.title}</h2>
                <p className="mt-4 text-gray-700">{post.excerpt}</p>
                <div className="mt-6 flex justify-center md:justify-end">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-block bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded text-sm font-semibold"
                  >
                    Read article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

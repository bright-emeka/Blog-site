import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4">Page not found.</p>
      <p className="mt-6">
        <Link href="/">
          <a className="underline">Return home</a>
        </Link>
      </p>
    </div>
  );
}

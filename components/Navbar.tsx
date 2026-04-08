import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 dark:border-zinc-700">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-semibold">
            SCROLLS
          </Link>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/">SCROLLS</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

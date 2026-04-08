import Head from 'next/head';
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force dark theme globally
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Personal Scrolls built with Next.js and TypeScript" />
        <meta name="og:title" content="Personal Scrolls" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">{children}</main>
        <Footer />
      </div>
    </>
  );
}

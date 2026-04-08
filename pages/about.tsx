import Head from 'next/head';
import { useState } from 'react';
export default function About() {
  const [status, setStatus] = useState<string | null>(null);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message') };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) setStatus('Thanks — message sent (logged to server).');
      else setStatus('Error sending message');
    } catch (err) {
      setStatus('Error sending message');
    }
  };

  return (
    <>
      <Head>
        <title>About • Dough_Lord</title>
        <meta name="description" content="About me" />
      </Head>
      <div>
        <h1 className="text-2xl font-bold">About</h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Hi — I'm a fullstack developer, an automation engineer, an astrologist, a therapist, a tech expert, just call me jack of all trades . Contact me at <a href="mailto:emeka0180@gmail.com" className="underline">emeka0180@gmail.com</a>.
        </p>

        <section className="mt-8 max-w-lg">
          <h2 className="text-lg font-semibold">Contact</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input name="name" placeholder="Your name" className="px-3 py-2 border rounded" required />
            <input name="email" type="email" placeholder="Your email" className="px-3 py-2 border rounded" required />
            <textarea name="message" placeholder="Message" className="px-3 py-2 border rounded" rows={4} required />
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Send</button>
              {status && <span className="text-sm text-gray-600">{status}</span>}
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

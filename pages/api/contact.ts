import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { name, email, message } = req.body || {};
  console.log('Contact form submission:', { name, email, message });
  return res.status(200).json({ ok: true });
}

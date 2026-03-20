const crypto = require('crypto');
const { getDb } = require('../_lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = {};
  for (const pair of (req.headers.cookie || '').split(';')) {
    const [key, ...vals] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(vals.join('='));
  }

  const sessionToken = cookies['arc_session'];
  if (sessionToken) {
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const sql = getDb();
    try {
      await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
    } catch (err) {
      console.error('Logout DB error:', err);
    }
  }

  // Clear cookies
  res.setHeader('Set-Cookie', [
    'arc_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    'arc_csrf=; Path=/; Secure; SameSite=Strict; Max-Age=0',
  ]);

  return res.status(200).json({ message: 'Logged out' });
};

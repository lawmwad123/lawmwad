const crypto = require('crypto');
const { getDb } = require('../_lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = {};
  for (const pair of (req.headers.cookie || '').split(';')) {
    const [key, ...vals] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(vals.join('='));
  }

  const sessionToken = cookies['arc_session'];
  if (!sessionToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const sql = getDb();

  try {
    const rows = await sql`
      SELECT u.id, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > NOW()
        AND u.is_active = true
    `;

    if (!rows.length) {
      return res.status(401).json({ error: 'Session expired' });
    }

    return res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

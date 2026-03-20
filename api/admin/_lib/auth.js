const crypto = require('crypto');
const { getDb } = require('./db');

function parseCookies(cookieStr) {
  const cookies = {};
  if (!cookieStr) return cookies;
  for (const pair of cookieStr.split(';')) {
    const [key, ...vals] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(vals.join('='));
  }
  return cookies;
}

function withAuth(handler, options = {}) {
  const { roles } = options;

  return async function (req, res) {
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionToken = cookies['arc_session'];

    if (!sessionToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const sql = getDb();

    try {
      const rows = await sql`
        SELECT s.user_id, s.expires_at, u.email, u.role, u.is_active
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token_hash = ${tokenHash}
          AND s.expires_at > NOW()
      `;

      if (!rows.length || !rows[0].is_active) {
        return res.status(401).json({ error: 'Session expired' });
      }

      const session = rows[0];

      // RBAC check
      if (roles && !roles.includes(session.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // CSRF check for mutating requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const csrfHeader = req.headers['x-csrf-token'];
        const csrfCookie = cookies['arc_csrf'];
        if (!csrfHeader || csrfHeader !== csrfCookie) {
          return res.status(403).json({ error: 'CSRF validation failed' });
        }
      }

      req.user = {
        id: session.user_id,
        email: session.email,
        role: session.role,
      };

      return handler(req, res);
    } catch (err) {
      console.error('Auth error:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
}

module.exports = { withAuth, parseCookies };

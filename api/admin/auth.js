const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('./_lib/db');

function parseCookies(cookieStr) {
  const cookies = {};
  if (!cookieStr) return cookies;
  for (const pair of cookieStr.split(';')) {
    const [key, ...vals] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(vals.join('='));
  }
  return cookies;
}

module.exports = async function handler(req, res) {
  const { action } = req.query;

  if (action === 'login' && req.method === 'POST') return handleLogin(req, res);
  if (action === 'logout' && req.method === 'POST') return handleLogout(req, res);
  if (action === 'me' && req.method === 'GET') return handleMe(req, res);

  return res.status(400).json({ error: 'Invalid action. Use ?action=login|logout|me' });
};

async function handleLogin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = getDb();

  try {
    const rows = await sql`
      SELECT id, email, password_hash, role, is_active
      FROM users WHERE email = ${email.toLowerCase().trim()}
    `;

    if (!rows.length) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    if (!user.is_active) return res.status(401).json({ error: 'Account is disabled' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const csrfToken = crypto.randomBytes(32).toString('hex');

    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
      VALUES (${user.id}, ${tokenHash}, ${expiresAt.toISOString()},
        ${req.headers['x-forwarded-for'] || 'unknown'},
        ${(req.headers['user-agent'] || 'unknown').slice(0, 255)})
    `;

    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    res.setHeader('Set-Cookie', [
      `arc_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
      `arc_csrf=${csrfToken}; Path=/; Secure; SameSite=Strict; Max-Age=86400`,
    ]);

    return res.status(200).json({ data: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function handleLogout(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies['arc_session'];

  if (sessionToken) {
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const sql = getDb();
    try { await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`; } catch {}
  }

  res.setHeader('Set-Cookie', [
    'arc_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    'arc_csrf=; Path=/; Secure; SameSite=Strict; Max-Age=0',
  ]);

  return res.status(200).json({ message: 'Logged out' });
}

async function handleMe(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies['arc_session'];

  if (!sessionToken) return res.status(401).json({ error: 'Not authenticated' });

  const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const sql = getDb();

  try {
    const rows = await sql`
      SELECT u.id, u.email, u.role
      FROM sessions s JOIN users u ON s.user_id = u.id
      WHERE s.token_hash = ${tokenHash} AND s.expires_at > NOW() AND u.is_active = true
    `;

    if (!rows.length) return res.status(401).json({ error: 'Session expired' });
    return res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

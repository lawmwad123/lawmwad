const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../_lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = getDb();

  try {
    const rows = await sql`
      SELECT id, email, password_hash, role, is_active
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is disabled' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Generate CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Store session
    await sql`
      INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
      VALUES (
        ${user.id},
        ${tokenHash},
        ${expiresAt.toISOString()},
        ${req.headers['x-forwarded-for'] || 'unknown'},
        ${(req.headers['user-agent'] || 'unknown').slice(0, 255)}
      )
    `;

    // Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // Set cookies
    const cookieOpts = `Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`;
    const csrfOpts = `Path=/; Secure; SameSite=Strict; Max-Age=86400`;

    res.setHeader('Set-Cookie', [
      `arc_session=${sessionToken}; ${cookieOpts}`,
      `arc_csrf=${csrfToken}; ${csrfOpts}`,
    ]);

    return res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

const bcrypt = require('bcryptjs');
const { getDb } = require('./_lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-seed-secret'] || req.body?.secret;
  if (secret !== process.env.ADMIN_SEED_SECRET) {
    return res.status(403).json({ error: 'Invalid secret' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const sql = getDb();

  try {
    // Check if admin already exists
    const existing = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Admin user already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await sql`
      INSERT INTO users (email, password_hash, role, is_active)
      VALUES (${email}, ${passwordHash}, 'admin', true)
      RETURNING id, email, role
    `;

    return res.status(201).json({
      message: 'Admin user created successfully',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.message?.includes('unique')) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error('Seed error:', err);
    return res.status(500).json({ error: 'Failed to create admin user' });
  }
};

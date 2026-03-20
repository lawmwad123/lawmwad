const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, lab, level, about } = req.body;

  if (!name || !email || !lab || !level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        lab TEXT NOT NULL,
        level TEXT NOT NULL,
        about TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO applications (name, email, lab, level, about)
      VALUES (${name}, ${email}, ${lab}, ${level}, ${about || ''})
    `;

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

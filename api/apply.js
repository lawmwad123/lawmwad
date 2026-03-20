const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, lab, level, about } = req.body;

  if (!name || !email || !phone || !lab || !level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      INSERT INTO applications_v2 (name, email, phone, lab, level, about, source)
      VALUES (${name}, ${email}, ${phone}, ${lab}, ${level}, ${about || ''}, 'website')
    `;

    return res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

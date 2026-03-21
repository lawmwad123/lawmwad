const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel may pass body as a raw string in some subdirectory project configs
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { name, email, org, industry } = body;

  if (!name || !email || !org || !industry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      INSERT INTO applications_v2 (name, email, phone, lab, level, about, source)
      VALUES (
        ${name.trim()},
        ${email.trim().toLowerCase()},
        ${''},
        ${industry.trim()},
        ${'demo-request'},
        ${org.trim()},
        ${'arc-ai'}
      )
    `;

    return res.status(200).json({ message: 'Demo request submitted successfully' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

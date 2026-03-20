const { withAuth } = require('../_lib/auth');
const { getDb } = require('../_lib/db');
const { serverError } = require('../_lib/errors');

module.exports = withAuth(async function handler(req, res) {
  const sql = getDb();

  if (req.method === 'GET') {
    try {
      const { status, lab, search } = req.query || {};

      let apps;
      if (search) {
        apps = await sql`
          SELECT * FROM applications_v2
          WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
          ${status ? sql`AND status = ${status}` : sql``}
          ${lab ? sql`AND lab = ${lab}` : sql``}
          ORDER BY created_at DESC
        `;
      } else {
        apps = await sql`
          SELECT * FROM applications_v2
          WHERE 1=1
          ${status ? sql`AND status = ${status}` : sql``}
          ${lab ? sql`AND lab = ${lab}` : sql``}
          ORDER BY created_at DESC
        `;
      }

      return res.status(200).json({ data: apps });
    } catch (err) {
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

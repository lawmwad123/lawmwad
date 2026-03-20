const { withAuth } = require('../_lib/auth');
const { getDb } = require('../_lib/db');
const { validate } = require('../_lib/validate');
const { logAudit } = require('../_lib/audit');
const { badRequest, serverError } = require('../_lib/errors');

module.exports = withAuth(async function handler(req, res) {
  const sql = getDb();

  if (req.method === 'GET') {
    try {
      const { division, status, search } = req.query || {};
      let projects;

      if (search) {
        projects = await sql`
          SELECT p.*, tm.name as lead_name
          FROM projects p
          LEFT JOIN team_members tm ON p.lead_id = tm.id
          WHERE p.name ILIKE ${'%' + search + '%'}
          ${division ? sql`AND p.division = ${division}` : sql``}
          ${status ? sql`AND p.status = ${status}` : sql``}
          ORDER BY p.created_at DESC
        `;
      } else {
        projects = await sql`
          SELECT p.*, tm.name as lead_name
          FROM projects p
          LEFT JOIN team_members tm ON p.lead_id = tm.id
          WHERE 1=1
          ${division ? sql`AND p.division = ${division}` : sql``}
          ${status ? sql`AND p.status = ${status}` : sql``}
          ORDER BY p.created_at DESC
        `;
      }

      return res.status(200).json({ data: projects });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'POST') {
    const errors = validate(req.body, {
      name: { required: true, maxLength: 255 },
      slug: { required: true, maxLength: 100 },
      division: { required: true, oneOf: ['software', 'robotics', 'mechanics', 'electronics', 'cross-division'] },
    });

    if (errors.length) return badRequest(res, 'Validation failed', errors);

    const { name, slug, description, division, status: projStatus, priority, start_date, target_end_date, budget_allocated, lead_id, repository_url } = req.body;

    try {
      const [project] = await sql`
        INSERT INTO projects (name, slug, description, division, status, priority, start_date, target_end_date, budget_allocated, lead_id, repository_url)
        VALUES (
          ${name}, ${slug}, ${description || null}, ${division},
          ${projStatus || 'planning'}, ${priority || 'medium'},
          ${start_date || null}, ${target_end_date || null},
          ${budget_allocated || 0}, ${lead_id || null},
          ${repository_url || null}
        )
        RETURNING *
      `;

      await logAudit(sql, req.user.id, 'create', 'project', project.id, null, req);
      return res.status(201).json({ data: project });
    } catch (err) {
      if (err.message?.includes('unique')) {
        return badRequest(res, 'A project with this slug already exists');
      }
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

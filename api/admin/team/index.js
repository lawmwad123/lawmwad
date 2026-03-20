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
      let members;

      if (search) {
        members = await sql`
          SELECT * FROM team_members
          WHERE (name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'})
          ${division ? sql`AND division = ${division}` : sql``}
          ${status ? sql`AND status = ${status}` : sql``}
          ORDER BY name ASC
        `;
      } else {
        members = await sql`
          SELECT * FROM team_members
          WHERE 1=1
          ${division ? sql`AND division = ${division}` : sql``}
          ${status ? sql`AND status = ${status}` : sql``}
          ORDER BY name ASC
        `;
      }

      return res.status(200).json({ data: members });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'POST') {
    const errors = validate(req.body, {
      name: { required: true, maxLength: 255 },
      email: { required: true, email: true },
      division: { required: true, oneOf: ['software', 'robotics', 'mechanics', 'electronics'] },
      role: { required: true, maxLength: 100 },
    });

    if (errors.length) return badRequest(res, 'Validation failed', errors);

    const { name, email, division, role, title, bio, skills, phone, join_date, status: memberStatus, linkedin_url, github_url } = req.body;

    try {
      const [member] = await sql`
        INSERT INTO team_members (name, email, division, role, title, bio, skills, phone, join_date, status, linkedin_url, github_url)
        VALUES (
          ${name}, ${email}, ${division}, ${role},
          ${title || null}, ${bio || null},
          ${skills || []}, ${phone || null},
          ${join_date || null}, ${memberStatus || 'active'},
          ${linkedin_url || null}, ${github_url || null}
        )
        RETURNING *
      `;

      await logAudit(sql, req.user.id, 'create', 'team_member', member.id, null, req);
      return res.status(201).json({ data: member });
    } catch (err) {
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

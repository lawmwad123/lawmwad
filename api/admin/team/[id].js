const { withAuth } = require('../_lib/auth');
const { getDb } = require('../_lib/db');
const { validate } = require('../_lib/validate');
const { logAudit, computeChanges } = require('../_lib/audit');
const { notFound, badRequest, serverError } = require('../_lib/errors');

module.exports = withAuth(async function handler(req, res) {
  const sql = getDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM team_members WHERE id = ${id}`;
      if (!rows.length) return notFound(res, 'Team member');

      // Get project assignments
      const projects = await sql`
        SELECT p.id, p.name, p.status, p.division, pm.role as assignment_role
        FROM project_members pm
        JOIN projects p ON pm.project_id = p.id
        WHERE pm.member_id = ${id}
        ORDER BY p.name
      `;

      return res.status(200).json({ data: { ...rows[0], projects } });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'PUT') {
    const errors = validate(req.body, {
      name: { required: true, maxLength: 255 },
      email: { required: true, email: true },
      division: { required: true, oneOf: ['software', 'robotics', 'mechanics', 'electronics'] },
      role: { required: true, maxLength: 100 },
    });

    if (errors.length) return badRequest(res, 'Validation failed', errors);

    try {
      const existing = await sql`SELECT * FROM team_members WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Team member');

      const { name, email, division, role, title, bio, skills, phone, join_date, status: memberStatus, linkedin_url, github_url } = req.body;

      const [updated] = await sql`
        UPDATE team_members SET
          name = ${name}, email = ${email}, division = ${division}, role = ${role},
          title = ${title || null}, bio = ${bio || null},
          skills = ${skills || []}, phone = ${phone || null},
          join_date = ${join_date || null}, status = ${memberStatus || 'active'},
          linkedin_url = ${linkedin_url || null}, github_url = ${github_url || null},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      const changes = computeChanges(existing[0], updated, ['name', 'email', 'division', 'role', 'status']);
      await logAudit(sql, req.user.id, 'update', 'team_member', id, changes, req);

      return res.status(200).json({ data: updated });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await sql`SELECT id FROM team_members WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Team member');

      await sql`DELETE FROM team_members WHERE id = ${id}`;
      await logAudit(sql, req.user.id, 'delete', 'team_member', id, null, req);

      return res.status(200).json({ message: 'Team member deleted' });
    } catch (err) {
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

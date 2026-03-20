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
      const rows = await sql`
        SELECT p.*, tm.name as lead_name
        FROM projects p
        LEFT JOIN team_members tm ON p.lead_id = tm.id
        WHERE p.id = ${id}
      `;
      if (!rows.length) return notFound(res, 'Project');

      const members = await sql`
        SELECT tm.id, tm.name, tm.division, tm.role, pm.role as assignment_role
        FROM project_members pm
        JOIN team_members tm ON pm.member_id = tm.id
        WHERE pm.project_id = ${id}
        ORDER BY tm.name
      `;

      const milestones = await sql`
        SELECT * FROM milestones
        WHERE project_id = ${id}
        ORDER BY sort_order ASC, due_date ASC
      `;

      return res.status(200).json({ data: { ...rows[0], members, milestones } });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'PUT') {
    const errors = validate(req.body, {
      name: { required: true, maxLength: 255 },
      division: { required: true, oneOf: ['software', 'robotics', 'mechanics', 'electronics', 'cross-division'] },
    });

    if (errors.length) return badRequest(res, 'Validation failed', errors);

    try {
      const existing = await sql`SELECT * FROM projects WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Project');

      const { name, description, division, status: projStatus, priority, start_date, target_end_date, actual_end_date, budget_allocated, budget_spent, lead_id, repository_url } = req.body;

      const [updated] = await sql`
        UPDATE projects SET
          name = ${name}, description = ${description || null},
          division = ${division}, status = ${projStatus || 'planning'},
          priority = ${priority || 'medium'},
          start_date = ${start_date || null}, target_end_date = ${target_end_date || null},
          actual_end_date = ${actual_end_date || null},
          budget_allocated = ${budget_allocated || 0}, budget_spent = ${budget_spent || 0},
          lead_id = ${lead_id || null}, repository_url = ${repository_url || null},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      const changes = computeChanges(existing[0], updated, ['name', 'status', 'priority', 'budget_allocated', 'budget_spent']);
      await logAudit(sql, req.user.id, 'update', 'project', id, changes, req);

      return res.status(200).json({ data: updated });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await sql`SELECT id FROM projects WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Project');

      await sql`DELETE FROM projects WHERE id = ${id}`;
      await logAudit(sql, req.user.id, 'delete', 'project', id, null, req);

      return res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

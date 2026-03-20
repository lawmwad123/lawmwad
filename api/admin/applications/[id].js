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
      const rows = await sql`SELECT * FROM applications_v2 WHERE id = ${id}`;
      if (!rows.length) return notFound(res, 'Application');
      return res.status(200).json({ data: rows[0] });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'PUT') {
    try {
      const existing = await sql`SELECT * FROM applications_v2 WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Application');

      const { status, rating, reviewer_id, stage_notes } = req.body;

      const validStatuses = ['new', 'screening', 'interview', 'trial', 'accepted', 'rejected', 'withdrawn'];
      if (status && !validStatuses.includes(status)) {
        return badRequest(res, `Status must be one of: ${validStatuses.join(', ')}`);
      }

      const [updated] = await sql`
        UPDATE applications_v2 SET
          status = COALESCE(${status || null}, status),
          rating = COALESCE(${rating || null}, rating),
          reviewer_id = COALESCE(${reviewer_id || null}, reviewer_id),
          stage_notes = COALESCE(${stage_notes ? JSON.stringify(stage_notes) : null}::jsonb, stage_notes),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      const changes = computeChanges(existing[0], updated, ['status', 'rating']);
      await logAudit(sql, req.user.id, 'update', 'application', id, changes, req);

      return res.status(200).json({ data: updated });
    } catch (err) {
      return serverError(res, err);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existing = await sql`SELECT id FROM applications_v2 WHERE id = ${id}`;
      if (!existing.length) return notFound(res, 'Application');

      await sql`DELETE FROM applications_v2 WHERE id = ${id}`;
      await logAudit(sql, req.user.id, 'delete', 'application', id, null, req);

      return res.status(200).json({ message: 'Application deleted' });
    } catch (err) {
      return serverError(res, err);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}, { roles: ['admin', 'director', 'lead'] });

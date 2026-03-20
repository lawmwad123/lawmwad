const { withAuth } = require('./_lib/auth');
const { getDb } = require('./_lib/db');
const { serverError } = require('./_lib/errors');

module.exports = withAuth(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = getDb();

  try {
    const [teamCount] = await sql`SELECT COUNT(*)::int as count FROM team_members WHERE status = 'active'`;
    const [projectCount] = await sql`SELECT COUNT(*)::int as count FROM projects WHERE status IN ('planning', 'active')`;
    const [appCount] = await sql`SELECT COUNT(*)::int as count FROM applications_v2 WHERE status NOT IN ('accepted', 'rejected', 'withdrawn')`;
    const [equipCount] = await sql`SELECT COUNT(*)::int as count FROM equipment WHERE status = 'available'`;

    const projectsByStatus = await sql`
      SELECT status, COUNT(*)::int as count
      FROM projects
      GROUP BY status
      ORDER BY status
    `;

    const recentApps = await sql`
      SELECT id, name, lab, level, status, created_at
      FROM applications_v2
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const recentAudit = await sql`
      SELECT al.action, al.entity_type, al.created_at, u.email
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `;

    const divisionBreakdown = await sql`
      SELECT division, COUNT(*)::int as count
      FROM team_members
      WHERE status = 'active'
      GROUP BY division
    `;

    return res.status(200).json({
      data: {
        stats: {
          teamMembers: teamCount.count,
          activeProjects: projectCount.count,
          pendingApps: appCount.count,
          availableEquipment: equipCount.count,
        },
        projectsByStatus,
        divisionBreakdown,
        recentApps,
        recentAudit,
      },
    });
  } catch (err) {
    return serverError(res, err);
  }
}, { roles: ['admin', 'director', 'lead', 'member', 'viewer'] });

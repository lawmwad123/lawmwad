async function logAudit(sql, userId, action, entityType, entityId, changes, req) {
  try {
    await sql`
      INSERT INTO audit_log (user_id, action, entity_type, entity_id, changes, ip_address, user_agent)
      VALUES (
        ${userId},
        ${action},
        ${entityType},
        ${entityId},
        ${changes ? JSON.stringify(changes) : null},
        ${req?.headers?.['x-forwarded-for'] || 'unknown'},
        ${(req?.headers?.['user-agent'] || 'unknown').slice(0, 255)}
      )
    `;
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

function computeChanges(oldObj, newObj, fields) {
  const changes = {};
  for (const field of fields) {
    const oldVal = oldObj[field];
    const newVal = newObj[field];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[field] = { old: oldVal, new: newVal };
    }
  }
  return Object.keys(changes).length ? changes : null;
}

module.exports = { logAudit, computeChanges };

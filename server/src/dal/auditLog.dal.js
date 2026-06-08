const { pool } = require('../config/db');
const logger = require('../config/logger');

async function log({ userId, action, entity, entityId, oldValues, newValues, ipAddress, userAgent }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId   || null,
        action,
        entity,
        entityId || null,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ipAddress || null,
        userAgent || null,
      ]
    );
  } catch (err) {
    // Audit log failure must never crash the main request
    logger.error('audit_log write failed', { err: err.message });
  }
}

module.exports = { log };

const { pool } = require('../config/db');

async function create({ user_id, role_target, type, title, content, data }) {
  const [result] = await pool.query(
    `INSERT INTO notifications (user_id, role_target, type, title, content, data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id || null, role_target || null, type, title, content || null,
     data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null]
  );
  return result.insertId;
}

function buildRoleTargets(role, isHomeroom) {
  if (role === 'teacher') {
    const subtype = isHomeroom ? 'homeroom_teacher' : 'professional_teacher';
    return ['all', 'all_teachers', 'teacher', subtype];
  }
  if (role === 'secretary') return ['all', 'all_secretaries', 'secretary'];
  if (role === 'admin')     return ['all', 'admin'];
  return ['all', role];
}

async function findByUser(userId, role, isHomeroom, { limit = 10, offset = 0 } = {}) {
  const targets = buildRoleTargets(role, isHomeroom);
  const placeholders = targets.map(() => '?').join(', ');
  const [rows] = await pool.query(
    `SELECT n.*,
       COALESCE(nr.user_id IS NOT NULL, n.is_read) AS is_read
     FROM notifications n
     LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
     WHERE n.user_id = ?
        OR n.role_target IN (${placeholders})
     ORDER BY n.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, userId, ...targets, limit, offset]
  );
  return rows;
}

async function countByUser(userId, role) {
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM notifications
     WHERE user_id = ? OR role_target = 'all' OR role_target = ?`,
    [userId, role]
  );
  return total;
}

async function markAllRead(userId, role, isHomeroom) {
  const targets = buildRoleTargets(role, isHomeroom);
  const placeholders = targets.map(() => '?').join(', ');
  const [rows] = await pool.query(
    `SELECT id FROM notifications
     WHERE user_id = ? OR role_target IN (${placeholders})`,
    [userId, ...targets]
  );
  if (!rows.length) return;
  const values = rows.map((r) => [userId, r.id]);
  await pool.query(`INSERT IGNORE INTO notification_reads (user_id, notification_id) VALUES ?`, [values]);
}

async function markOneRead(notificationId, userId) {
  await pool.query(
    `INSERT IGNORE INTO notification_reads (user_id, notification_id) VALUES (?, ?)`,
    [userId, notificationId]
  );
}

async function getUnreadCount(userId, role, isHomeroom) {
  const targets = buildRoleTargets(role, isHomeroom);
  const placeholders = targets.map(() => '?').join(', ');
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM notifications n
     LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
     WHERE nr.user_id IS NULL
       AND (n.user_id = ? OR n.role_target IN (${placeholders}))`,
    [userId, userId, ...targets]
  );
  return count;
}

module.exports = { create, findByUser, countByUser, markAllRead, markOneRead, getUnreadCount };

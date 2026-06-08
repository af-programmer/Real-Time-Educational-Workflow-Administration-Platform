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

async function findByUser(userId, role) {
  const [rows] = await pool.query(
    `SELECT n.*,
       COALESCE(nr.user_id IS NOT NULL, n.is_read) AS is_read
     FROM notifications n
     LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
     WHERE n.user_id = ?
        OR n.role_target = 'all'
        OR n.role_target = ?
     ORDER BY n.created_at DESC
     LIMIT 50`,
    [userId, userId, role]
  );
  return rows;
}

async function markAllRead(userId, role) {
  const [rows] = await pool.query(
    `SELECT id FROM notifications
     WHERE user_id = ? OR role_target = 'all' OR role_target = ?`,
    [userId, role]
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

async function getUnreadCount(userId, role) {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM notifications n
     LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
     WHERE nr.user_id IS NULL
       AND (n.user_id = ? OR n.role_target = 'all' OR n.role_target = ?)`,
    [userId, userId, role]
  );
  return count;
}

module.exports = { create, findByUser, markAllRead, markOneRead, getUnreadCount };

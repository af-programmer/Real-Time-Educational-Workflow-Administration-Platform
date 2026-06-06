const { pool } = require('../config/db');

async function create({ user_id, role_target, type, title, content, entity_id, entity_type }) {
  const [result] = await pool.query(
    `INSERT INTO notifications (user_id, role_target, type, title, content, entity_id, entity_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id || null, role_target || null, type, title, content, entity_id || null, entity_type || null]
  );
  return result.insertId;
}

async function findByUser(userId, role) {
  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
        OR role_target = 'all'
        OR role_target = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId, role]
  );
  return rows;
}

async function markAllRead(userId, role) {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE
     WHERE (user_id = ? OR role_target = 'all' OR role_target = ?)
       AND is_read = FALSE`,
    [userId, role]
  );
}

async function getUnreadCount(userId, role) {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM notifications
     WHERE is_read = FALSE
       AND (user_id = ? OR role_target = 'all' OR role_target = ?)`,
    [userId, role]
  );
  return count;
}

module.exports = { create, findByUser, markAllRead, getUnreadCount };

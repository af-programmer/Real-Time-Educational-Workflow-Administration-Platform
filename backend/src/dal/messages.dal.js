const { pool } = require('../config/db');

async function create({ sender_id, recipient_id, recipient_role, subject, body, is_broadcast }) {
  const [result] = await pool.query(
    `INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sender_id, recipient_id || null, recipient_role || null, subject || null, body, is_broadcast ? 1 : 0]
  );
  return result.insertId;
}

async function findInbox(userId, role) {
  const [rows] = await pool.query(
    `SELECT m.*, u.name AS sender_name, u.email AS sender_email, ur.name AS sender_role
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     JOIN roles ur ON ur.id = u.role_id
     WHERE (m.recipient_id = ?
        OR m.recipient_role = 'all'
        OR m.recipient_role = ?
        OR (m.recipient_role = 'all_teachers' AND ? = 'teacher')
        OR (m.recipient_role = 'all_secretaries' AND ? = 'secretary'))
     ORDER BY m.created_at DESC`,
    [userId, role, role, role]
  );
  return rows;
}

async function findSent(senderId) {
  const [rows] = await pool.query(
    `SELECT m.*, u.name AS recipient_name
     FROM messages m
     LEFT JOIN users u ON u.id = m.recipient_id
     WHERE m.sender_id = ?
     ORDER BY m.created_at DESC`,
    [senderId]
  );
  return rows;
}

async function markRead(messageId, userId) {
  await pool.query(
    'UPDATE messages SET is_read = TRUE WHERE id = ? AND recipient_id = ?',
    [messageId, userId]
  );
}

async function getUnreadCount(userId, role) {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM messages
     WHERE is_read = FALSE
       AND (recipient_id = ?
        OR recipient_role = 'all'
        OR recipient_role = ?
        OR (recipient_role = 'all_teachers' AND ? = 'teacher')
        OR (recipient_role = 'all_secretaries' AND ? = 'secretary'))`,
    [userId, role, role, role]
  );
  return count;
}

module.exports = { create, findInbox, findSent, markRead, getUnreadCount };

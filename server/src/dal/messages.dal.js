const { pool } = require('../config/db');

async function create({ sender_id, recipient_id, recipient_role, subject, body, is_broadcast, attachment_path, attachment_name }) {
  const [result] = await pool.query(
    `INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, attachment_path, attachment_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sender_id, recipient_id || null, recipient_role || null, subject || null, body, is_broadcast ? 1 : 0, attachment_path || null, attachment_name || null]
  );
  return result.insertId;
}

async function findInbox(userId, role) {
  const [rows] = await pool.query(
    `SELECT
       m.id, m.sender_id, m.recipient_id, m.recipient_role,
       m.subject, m.body, m.is_broadcast,
       m.attachment_path, m.attachment_name, m.created_at,
       sender_u.name  AS sender_name,
       sender_u.email AS sender_email,
       sender_r.name  AS sender_role,
       (mr.user_id IS NOT NULL) AS is_read
     FROM messages m
     JOIN users sender_u ON sender_u.id = m.sender_id
     JOIN roles sender_r ON sender_r.id = sender_u.role_id
     LEFT JOIN message_reads   mr ON mr.message_id = m.id AND mr.user_id = ?
     LEFT JOIN message_deletes md ON md.message_id = m.id AND md.user_id = ?
     WHERE md.user_id IS NULL
       AND m.sender_id != ?
       AND (m.recipient_id = ?
        OR m.recipient_role = 'all'
        OR m.recipient_role = ?
        OR (m.recipient_role = 'all_teachers'    AND ? = 'teacher')
        OR (m.recipient_role = 'all_secretaries' AND ? = 'secretary'))
     ORDER BY m.created_at DESC`,
    [userId, userId, userId, userId, role, role, role]
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
    `INSERT IGNORE INTO message_reads (user_id, message_id) VALUES (?, ?)`,
    [userId, messageId]
  );
}

async function deleteForUser(messageId, userId) {
  await pool.query(
    `INSERT IGNORE INTO message_deletes (user_id, message_id) VALUES (?, ?)`,
    [userId, messageId]
  );
}

async function getUnreadCount(userId, role) {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM messages m
     LEFT JOIN message_reads mr ON mr.message_id = m.id AND mr.user_id = ?
     LEFT JOIN message_deletes md ON md.message_id = m.id AND md.user_id = ?
     WHERE mr.user_id IS NULL
       AND md.user_id IS NULL
       AND m.sender_id != ?
       AND (m.recipient_id = ?
        OR m.recipient_role = 'all'
        OR m.recipient_role = ?
        OR (m.recipient_role = 'all_teachers' AND ? = 'teacher')
        OR (m.recipient_role = 'all_secretaries' AND ? = 'secretary'))`,
    [userId, userId, userId, userId, role, role, role]
  );
  return count;
}

module.exports = { create, findInbox, findSent, markRead, deleteForUser, getUnreadCount };

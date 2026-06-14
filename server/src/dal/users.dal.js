const { pool } = require('../config/db');
const { buildUpdateClause } = require('../utils/buildUpdateClause');

async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT u.*, uc.password_hash, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     JOIN user_credentials uc ON uc.user_id = u.id
     WHERE u.email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.is_suspended,
            u.phone, u.phone2, u.avatar_url, u.created_at, u.updated_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE u.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findAll({ roleFilter, search, page, limit, offset }) {
  let where = 'WHERE 1=1';
  const params = [];

  if (roleFilter === 'all_teachers') {
    where += " AND r.name IN ('teacher', 'Educator')";
  } else if (roleFilter) {
    where += ' AND r.name = ?';
    params.push(roleFilter);
  }

  if (search) {
    where += ' AND (u.name LIKE ? OR u.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM users u JOIN roles r ON u.role_id = r.id ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.is_active, u.is_suspended,
            u.phone, u.phone2, u.avatar_url, u.created_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     ${where}
     ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
}

async function create({ name, email, role_id, phone, phone2 }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, role_id, phone, phone2) VALUES (?, ?, ?, ?, ?)`,
    [name, email, role_id, phone || null, phone2 || null]
  );
  return result.insertId;
}

async function createCredential(userId, password_hash) {
  await pool.query(
    `INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [userId, password_hash]
  );
}

async function update(id, fields) {
  const { clause, values, hasFields } = buildUpdateClause(
    fields, ['name', 'email', 'phone', 'phone2', 'is_active', 'avatar_url', 'role_id']
  );
  if (!hasFields) return false;
  await pool.query(`UPDATE users SET ${clause} WHERE id = ?`, [...values, id]);
  return true;
}

async function updatePassword(userId, password_hash) {
  await pool.query(
    `UPDATE user_credentials SET password_hash = ? WHERE user_id = ?`,
    [password_hash, userId]
  );
}

async function setSuspended(id, is_suspended) {
  await pool.query('UPDATE users SET is_suspended = ? WHERE id = ?', [is_suspended ? 1 : 0, id]);
}

async function cleanupUserData(id) {
  await pool.query('UPDATE grades SET teacher_id = NULL WHERE teacher_id = ?', [id]);
  await pool.query('DELETE FROM teacher_classes WHERE teacher_id = ?', [id]);
  await pool.query('DELETE FROM teacher_subjects WHERE teacher_id = ?', [id]);
  await pool.query('DELETE FROM teacher_homeroom_classes WHERE teacher_id = ?', [id]);
  await pool.query('DELETE FROM user_credentials WHERE user_id = ?', [id]);
}

async function remove(id) {
  await cleanupUserData(id);
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function getRoleId(roleName) {
  const [rows] = await pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', [roleName]);
  return rows[0]?.id || null;
}

async function findPasswordHash(userId) {
  const [rows] = await pool.query(
    'SELECT password_hash FROM user_credentials WHERE user_id = ? LIMIT 1',
    [userId]
  );
  return rows[0]?.password_hash || null;
}

module.exports = {
  findByEmail, findById, findAll, create, createCredential, update,
  updatePassword, setSuspended, cleanupUserData, remove, getRoleId, findPasswordHash,
};

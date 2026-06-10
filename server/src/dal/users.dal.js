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

async function getTeachersByClass(classId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.name, u.email
     FROM users u
     JOIN teacher_classes tc ON tc.teacher_id = u.id
     WHERE tc.class_id = ? AND u.is_active = TRUE`,
    [classId]
  );
  return rows;
}

async function assignHomeroomClasses(teacherId, classIds) {
  await pool.query('DELETE FROM teacher_homeroom_classes WHERE teacher_id = ?', [teacherId]);
  if (!classIds.length) return;
  const values = classIds.map((cid) => [teacherId, cid]);
  await pool.query('INSERT INTO teacher_homeroom_classes (teacher_id, class_id) VALUES ?', [values]);
}

async function getHomeroomClasses(teacherId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.student_count, gl.label AS grade_level
     FROM classes c
     JOIN teacher_homeroom_classes thc ON thc.class_id = c.id
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE thc.teacher_id = ? AND c.is_active = TRUE`,
    [teacherId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.is_suspended,
            u.phone, u.phone2, u.is_homeroom,
            u.avatar_url, u.created_at, u.updated_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE u.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findAll({ roleFilter, search, page, limit, offset }) {
  let where = 'WHERE 1=1';
  const params = [];

  if (roleFilter) { where += ' AND r.name = ?'; params.push(roleFilter); }
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
            u.phone, u.phone2, u.created_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     ${where}
     ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
}

async function create({ name, email, role_id, phone, phone2, is_homeroom }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, role_id, phone, phone2, is_homeroom) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, role_id, phone || null, phone2 || null, is_homeroom ? 1 : 0]
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
    fields, ['name', 'email', 'phone', 'phone2', 'is_active', 'avatar_url', 'is_homeroom']
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

async function remove(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function getRoleId(roleName) {
  const [rows] = await pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', [roleName]);
  return rows[0]?.id || null;
}

async function assignClasses(teacherId, classIds) {
  await pool.query('DELETE FROM teacher_classes WHERE teacher_id = ?', [teacherId]);
  if (!classIds.length) return;
  const values = classIds.map((cid) => [teacherId, cid]);
  await pool.query('INSERT INTO teacher_classes (teacher_id, class_id) VALUES ?', [values]);
}

async function assignSubjects(teacherId, subjectIds) {
  await pool.query('DELETE FROM teacher_subjects WHERE teacher_id = ?', [teacherId]);
  if (!subjectIds.length) return;
  const values = subjectIds.map((sid) => [teacherId, sid]);
  await pool.query('INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES ?', [values]);
}

async function getTeacherClasses(teacherId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.name, c.student_count, gl.label AS grade_level
     FROM classes c
     JOIN teacher_classes tc ON tc.class_id = c.id
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE tc.teacher_id = ? AND c.is_active = TRUE`,
    [teacherId]
  );
  return rows;
}

async function getTeacherSubjects(teacherId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.description
     FROM subjects s
     JOIN teacher_subjects ts ON ts.subject_id = s.id
     WHERE ts.teacher_id = ?`,
    [teacherId]
  );
  return rows;
}

module.exports = {
  findByEmail, findById, findAll, create, createCredential, update,
  updatePassword, setSuspended, remove, getRoleId,
  assignClasses, assignSubjects, getTeacherClasses, getTeacherSubjects,
  getTeachersByClass, assignHomeroomClasses, getHomeroomClasses,
};

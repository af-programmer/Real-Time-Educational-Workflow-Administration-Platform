const { pool } = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT u.*, r.name AS role FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role_id, u.is_active, u.is_blocked,
            u.phone, u.avatar_url, u.created_at, u.updated_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE u.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findAll({ roleFilter, search, page, limit, offset }) {
  let sql = `SELECT u.id, u.name, u.email, u.is_active, u.is_blocked,
                    u.phone, u.created_at, r.name AS role
             FROM users u JOIN roles r ON u.role_id = r.id WHERE 1=1`;
  const params = [];

  if (roleFilter) {
    sql += ' AND r.name = ?';
    params.push(roleFilter);
  }
  if (search) {
    sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[{ total }]] = await pool.query(
    sql.replace('SELECT u.id, u.name, u.email, u.is_active, u.is_blocked, u.phone, u.created_at, r.name AS role', 'SELECT COUNT(*) AS total'),
    params
  );

  sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query(sql, params);
  return { rows, total };
}

async function create({ name, email, password_hash, role_id, phone }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id, phone) VALUES (?, ?, ?, ?, ?)`,
    [name, email, password_hash, role_id, phone || null]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['name', 'email', 'phone', 'is_active', 'avatar_url'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined)
    .map((k) => `${k} = ?`);

  if (!updates.length) return false;

  const values = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined)
    .map((k) => fields[k]);

  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
  return true;
}

async function updatePassword(id, password_hash) {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
}

async function setBlocked(id, is_blocked) {
  await pool.query('UPDATE users SET is_blocked = ? WHERE id = ?', [is_blocked ? 1 : 0, id]);
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
    `SELECT c.id, c.name, c.student_count, c.grade_level
     FROM classes c
     JOIN teacher_classes tc ON tc.class_id = c.id
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
  findByEmail, findById, findAll, create, update, updatePassword,
  setBlocked, remove, getRoleId, assignClasses, assignSubjects,
  getTeacherClasses, getTeacherSubjects,
};

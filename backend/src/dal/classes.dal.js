const { pool } = require('../config/db');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM classes WHERE is_active = TRUE ORDER BY name ASC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM classes WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByIds(ids) {
  if (!ids.length) return [];
  const [rows] = await pool.query(
    'SELECT id, name, student_count FROM classes WHERE id IN (?)',
    [ids]
  );
  return rows;
}

async function create({ name, student_count, grade_level, academic_year }) {
  const [result] = await pool.query(
    'INSERT INTO classes (name, student_count, grade_level, academic_year) VALUES (?, ?, ?, ?)',
    [name, student_count, grade_level, academic_year]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['name', 'student_count', 'grade_level', 'academic_year', 'is_active'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k))
    .map((k) => `${k} = ?`);
  if (!updates.length) return false;
  const values = Object.keys(fields)
    .filter((k) => allowed.includes(k))
    .map((k) => fields[k]);
  await pool.query(`UPDATE classes SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
  return true;
}

async function getStudentsByClass(classId) {
  const [rows] = await pool.query(
    'SELECT id, name, student_number FROM students WHERE class_id = ? AND is_active = TRUE ORDER BY name ASC',
    [classId]
  );
  return rows;
}

module.exports = { findAll, findById, findByIds, create, update, getStudentsByClass };

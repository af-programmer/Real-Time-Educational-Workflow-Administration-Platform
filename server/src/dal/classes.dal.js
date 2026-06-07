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
    'SELECT id, name, student_number, parent_phone, parent_email, date_of_birth FROM students WHERE class_id = ? AND is_active = TRUE ORDER BY name ASC',
    [classId]
  );
  return rows;
}

async function getAllStudents() {
  const [rows] = await pool.query(
    `SELECT s.*, c.name AS class_name FROM students s
     JOIN classes c ON c.id = s.class_id
     WHERE s.is_active = TRUE ORDER BY c.name ASC, s.name ASC`
  );
  return rows;
}

async function findStudentById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, c.name AS class_name FROM students s
     JOIN classes c ON c.id = s.class_id
     WHERE s.id = ? LIMIT 1`, [id]
  );
  return rows[0] || null;
}

async function getNextStudentNumber() {
  const [rows] = await pool.query(
    "SELECT MAX(CAST(student_number AS UNSIGNED)) AS max_num FROM students WHERE student_number REGEXP '^[0-9]+$'"
  );
  return String((rows[0].max_num || 0) + 1);
}

async function createStudent({ name, class_id, date_of_birth, parent_email, parent_phone }) {
  const student_number = await getNextStudentNumber();
  const [result] = await pool.query(
    `INSERT INTO students (name, class_id, student_number, date_of_birth, parent_email, parent_phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, class_id, student_number, date_of_birth || null, parent_email || null, parent_phone || null]
  );
  return result.insertId;
}

async function updateStudent(id, fields) {
  const allowed = ['name', 'class_id', 'student_number', 'date_of_birth', 'parent_email', 'parent_phone'];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!keys.length) return false;
  const updates = keys.map((k) => `${k} = ?`);
  // convert empty strings to null for optional/unique fields
  const values = keys.map((k) => (fields[k] === '' ? null : fields[k]));
  await pool.query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
  return true;
}

async function deleteStudent(id) {
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, findByIds, create, update, getStudentsByClass, getAllStudents, findStudentById, createStudent, updateStudent, deleteStudent };

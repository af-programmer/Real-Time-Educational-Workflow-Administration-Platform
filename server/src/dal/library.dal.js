const { pool } = require('../config/db');
const { buildUpdateClause } = require('../utils/buildUpdateClause');

async function findByTeacher(teacherId) {
  const [rows] = await pool.query(
    `SELECT tl.*, COALESCE(s.name, 'Others') AS subject_name
     FROM teacher_library tl
     LEFT JOIN subjects s ON s.id = tl.subject_id
     WHERE tl.teacher_id = ?
     ORDER BY CASE WHEN tl.subject_id IS NULL THEN 1 ELSE 0 END, s.name ASC, tl.created_at DESC`,
    [teacherId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT tl.*, COALESCE(s.name, 'Others') AS subject_name
     FROM teacher_library tl
     LEFT JOIN subjects s ON s.id = tl.subject_id
     WHERE tl.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ teacher_id, subject_id, original_name, stored_name, file_size, mime_type, description }) {
  const [result] = await pool.query(
    `INSERT INTO teacher_library (teacher_id, subject_id, original_name, stored_name, file_size, mime_type, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [teacher_id, subject_id, original_name, stored_name, file_size, mime_type, description || null]
  );
  return result.insertId;
}

async function update(id, fields) {
  const { clause, values, hasFields } = buildUpdateClause(fields, ['description', 'subject_id']);
  if (!hasFields) return false;
  await pool.query(`UPDATE teacher_library SET ${clause} WHERE id = ?`, [...values, id]);
  return true;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM teacher_library WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findByTeacher, findById, create, update, remove };

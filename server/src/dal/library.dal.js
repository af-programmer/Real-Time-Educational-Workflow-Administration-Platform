const { pool } = require('../config/db');

async function findByTeacher(teacherId) {
  const [rows] = await pool.query(
    `SELECT tl.*, s.name AS subject_name
     FROM teacher_library tl
     JOIN subjects s ON s.id = tl.subject_id
     WHERE tl.teacher_id = ?
     ORDER BY s.name ASC, tl.created_at DESC`,
    [teacherId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT tl.*, s.name AS subject_name
     FROM teacher_library tl
     JOIN subjects s ON s.id = tl.subject_id
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

async function update(id, { description, subject_id }) {
  const fields = [];
  const values = [];
  if (description !== undefined) { fields.push('description = ?'); values.push(description); }
  if (subject_id !== undefined) { fields.push('subject_id = ?'); values.push(subject_id); }
  if (!fields.length) return false;
  await pool.query(`UPDATE teacher_library SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  return true;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM teacher_library WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findByTeacher, findById, create, update, remove };

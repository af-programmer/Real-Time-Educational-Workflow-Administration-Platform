const { pool } = require('../config/db');

async function create({ student_id, subject_id, teacher_id, grade, max_grade, date, exam_type, notes }) {
  const [result] = await pool.query(
    `INSERT INTO grades (student_id, subject_id, teacher_id, grade, max_grade, date, exam_type, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [student_id, subject_id, teacher_id, grade, max_grade || 100, date, exam_type || 'test', notes || null]
  );
  return result.insertId;
}

async function update(id, fields) {
  const allowed = ['grade', 'max_grade', 'date', 'exam_type', 'notes'];
  const updates = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined)
    .map((k) => `${k} = ?`);
  if (!updates.length) return false;
  const values = Object.keys(fields)
    .filter((k) => allowed.includes(k) && fields[k] !== undefined)
    .map((k) => fields[k]);
  await pool.query(`UPDATE grades SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
  return true;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT g.*, s.name AS student_name, sub.name AS subject_name,
            u.name AS teacher_name, cl.name AS class_name
     FROM grades g
     JOIN students s ON s.id = g.student_id
     JOIN subjects sub ON sub.id = g.subject_id
     JOIN users u ON u.id = g.teacher_id
     JOIN classes cl ON cl.id = s.class_id
     WHERE g.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByTeacher(teacherId, { classId, subjectId } = {}) {
  let sql = `
    SELECT g.*, s.name AS student_name, sub.name AS subject_name,
           cl.name AS class_name, cl.id AS class_id
    FROM grades g
    JOIN students s ON s.id = g.student_id
    JOIN subjects sub ON sub.id = g.subject_id
    JOIN classes cl ON cl.id = s.class_id
    WHERE g.teacher_id = ?
  `;
  const params = [teacherId];

  if (classId) { sql += ' AND cl.id = ?'; params.push(classId); }
  if (subjectId) { sql += ' AND g.subject_id = ?'; params.push(subjectId); }

  sql += ' ORDER BY g.date DESC, g.created_at DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function findByStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT g.*, sub.name AS subject_name, u.name AS teacher_name
     FROM grades g
     JOIN subjects sub ON sub.id = g.subject_id
     JOIN users u ON u.id = g.teacher_id
     WHERE g.student_id = ?
     ORDER BY g.date DESC`,
    [studentId]
  );
  return rows;
}

async function verifyTeacherOwnership(gradeId, teacherId) {
  const [rows] = await pool.query(
    'SELECT id FROM grades WHERE id = ? AND teacher_id = ?',
    [gradeId, teacherId]
  );
  return rows.length > 0;
}

module.exports = { create, update, findById, findByTeacher, findByStudent, verifyTeacherOwnership };

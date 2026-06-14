const { pool } = require('../config/db');
const { buildUpdateClause } = require('../utils/buildUpdateClause');

async function create({ student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date, notes }) {
  const [result] = await pool.query(
    `INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [student_id, subject_id, teacher_id, exam_type_id, grade, max_grade || 100, date, notes || null]
  );
  return result.insertId;
}

async function update(id, fields) {
  if (fields.date) fields.date = fields.date.toString().slice(0, 10);
  const { clause, values, hasFields } = buildUpdateClause(fields, ['grade', 'max_grade', 'date', 'exam_type_id', 'notes']);
  if (!hasFields) return false;
  await pool.query(`UPDATE grades SET ${clause} WHERE id = ?`, [...values, id]);
  return true;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT g.*, s.name AS student_name, sub.name AS subject_name,
            u.name AS teacher_name, cl.name AS class_name, et.code AS exam_type, et.label AS exam_type_label
     FROM grades g
     JOIN students s   ON s.id  = g.student_id
     JOIN subjects sub ON sub.id = g.subject_id
     JOIN users u      ON u.id  = g.teacher_id
     JOIN classes cl   ON cl.id = s.class_id
     JOIN exam_types et ON et.id = g.exam_type_id
     WHERE g.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByTeacher(teacherId, { classId, subjectId } = {}) {
  let sql = `
    SELECT g.*, s.name AS student_name, sub.name AS subject_name,
           cl.name AS class_name, cl.id AS class_id, et.code AS exam_type
    FROM grades g
    JOIN students s    ON s.id  = g.student_id
    JOIN subjects sub  ON sub.id = g.subject_id
    JOIN classes cl    ON cl.id = s.class_id
    JOIN exam_types et ON et.id = g.exam_type_id
    WHERE g.teacher_id = ?
  `;
  const params = [teacherId];
  if (classId)   { sql += ' AND cl.id = ?';       params.push(classId); }
  if (subjectId) { sql += ' AND g.subject_id = ?'; params.push(subjectId); }
  sql += ' ORDER BY g.date DESC, g.created_at DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function findByStudent(studentId, teacherSubjectIds = null) {
  let sql = `
    SELECT g.*, sub.name AS subject_name, u.name AS teacher_name, et.code AS exam_type
     FROM grades g
     JOIN subjects sub  ON sub.id = g.subject_id
     JOIN users u       ON u.id  = g.teacher_id
     JOIN exam_types et ON et.id = g.exam_type_id
     WHERE g.student_id = ?`;
  const params = [studentId];
  if (teacherSubjectIds && teacherSubjectIds.length) {
    sql += ` AND g.subject_id IN (${teacherSubjectIds.map(() => '?').join(',')})`;
    params.push(...teacherSubjectIds);
  }
  sql += ' ORDER BY g.date DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function verifyTeacherOwnership(gradeId, teacherId) {
  const [rows] = await pool.query(
    'SELECT id FROM grades WHERE id = ? AND teacher_id = ?',
    [gradeId, teacherId]
  );
  return rows.length > 0;
}

async function getExamTypes() {
  const [rows] = await pool.query('SELECT id, code, label FROM exam_types ORDER BY label');
  return rows;
}

async function findStudentInClasses(studentId, classIds) {
  const [rows] = await pool.query(
    'SELECT id, class_id FROM students WHERE id = ? AND class_id IN (?) AND is_active = TRUE',
    [studentId, classIds.length ? classIds : [0]]
  );
  return rows;
}

module.exports = { create, update, findById, findByTeacher, findByStudent, verifyTeacherOwnership, getExamTypes, findStudentInClasses };

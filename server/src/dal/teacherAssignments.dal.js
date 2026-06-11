const { pool } = require('../config/db');

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

module.exports = {
  assignClasses, assignSubjects, getTeacherClasses, getTeacherSubjects,
  getTeachersByClass, assignHomeroomClasses, getHomeroomClasses,
};

const { pool } = require('../config/db');
const { buildUpdateClause } = require('../utils/buildUpdateClause');

async function findAll() {
  const [rows] = await pool.query(
    `SELECT c.*, gl.code AS grade_level_code, gl.label AS grade_level
     FROM classes c
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE c.is_active = TRUE ORDER BY c.name ASC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT c.*, gl.code AS grade_level_code, gl.label AS grade_level
     FROM classes c
     JOIN grade_levels gl ON gl.id = c.grade_level_id
     WHERE c.id = ? LIMIT 1`,
    [id]
  );
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

async function create({ name, student_count, grade_level_id, academic_year }) {
  const [result] = await pool.query(
    'INSERT INTO classes (name, student_count, grade_level_id, academic_year) VALUES (?, ?, ?, ?)',
    [name, student_count, grade_level_id, academic_year]
  );
  return result.insertId;
}

async function update(id, fields) {
  const { clause, values, hasFields } = buildUpdateClause(
    fields, ['name', 'student_count', 'grade_level_id', 'academic_year', 'is_active']
  );
  if (!hasFields) return false;
  await pool.query(`UPDATE classes SET ${clause} WHERE id = ?`, [...values, id]);
  return true;
}

async function getStudentsByClass(classId) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, id_number, student_number, phone_father, phone_mother, phone_home,
              parent_email, date_of_birth
       FROM students WHERE class_id = ? AND is_active = TRUE ORDER BY name ASC`,
      [classId]
    );
    return rows;
  } catch {
    // id_number column missing — run database/migrate.sql to add it
    const [rows] = await pool.query(
      `SELECT id, name, NULL AS id_number, student_number, phone_father, phone_mother, phone_home,
              parent_email, date_of_birth
       FROM students WHERE class_id = ? AND is_active = TRUE ORDER BY name ASC`,
      [classId]
    );
    return rows;
  }
}

async function getAllStudents() {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.id_number, s.student_number, s.class_id, s.date_of_birth,
              s.phone_father, s.phone_mother, s.phone_home, s.parent_email,
              c.name AS class_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       WHERE s.is_active = TRUE ORDER BY c.name ASC, s.name ASC`
    );
    return rows;
  } catch {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, NULL AS id_number, s.student_number, s.class_id, s.date_of_birth,
              s.phone_father, s.phone_mother, s.phone_home, s.parent_email,
              c.name AS class_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       WHERE s.is_active = TRUE ORDER BY c.name ASC, s.name ASC`
    );
    return rows;
  }
}

async function findStudentById(id) {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.id_number, s.student_number, s.class_id, s.date_of_birth,
              s.phone_father, s.phone_mother, s.phone_home, s.parent_email,
              c.name AS class_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       WHERE s.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  } catch {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, NULL AS id_number, s.student_number, s.class_id, s.date_of_birth,
              s.phone_father, s.phone_mother, s.phone_home, s.parent_email,
              c.name AS class_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       WHERE s.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }
}

async function getNextStudentNumber() {
  const [rows] = await pool.query(
    "SELECT MAX(CAST(student_number AS UNSIGNED)) AS max_num FROM students WHERE student_number REGEXP '^[0-9]+$'"
  );
  return String((rows[0].max_num || 0) + 1);
}

async function createStudent({ name, id_number, class_id, date_of_birth, parent_email, phone_father, phone_mother, phone_home }) {
  const student_number = await getNextStudentNumber();
  const [result] = await pool.query(
    `INSERT INTO students (name, id_number, class_id, student_number, date_of_birth, parent_email, phone_father, phone_mother, phone_home)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, id_number || null, class_id, student_number, date_of_birth || null, parent_email || null,
     phone_father || null, phone_mother || null, phone_home || null]
  );
  await pool.query('UPDATE classes SET student_count = student_count + 1 WHERE id = ?', [class_id]);
  return result.insertId;
}

async function updateStudent(id, fields) {
  const allowed = ['name', 'id_number', 'class_id', 'date_of_birth',
                   'parent_email', 'phone_father', 'phone_mother', 'phone_home'];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!keys.length) return false;

  if (fields.class_id !== undefined) {
    const [[existing]] = await pool.query('SELECT class_id FROM students WHERE id = ?', [id]);
    const oldClassId = existing?.class_id;
    const newClassId = Number(fields.class_id);
    if (oldClassId && oldClassId !== newClassId) {
      await Promise.all([
        pool.query('UPDATE classes SET student_count = GREATEST(student_count - 1, 0) WHERE id = ?', [oldClassId]),
        pool.query('UPDATE classes SET student_count = student_count + 1 WHERE id = ?', [newClassId]),
      ]);
    }
  }

  const clause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => (fields[k] === '' ? null : fields[k]));
  await pool.query(`UPDATE students SET ${clause} WHERE id = ?`, [...values, id]);
  return true;
}

async function deleteStudent(id) {
  const [[row]] = await pool.query('SELECT class_id FROM students WHERE id = ?', [id]);
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
  if (row?.class_id) {
    await pool.query('UPDATE classes SET student_count = GREATEST(student_count - 1, 0) WHERE id = ?', [row.class_id]);
  }
  return true;
}

module.exports = {
  findAll, findById, findByIds, create, update,
  getStudentsByClass, getAllStudents, findStudentById,
  createStudent, updateStudent, deleteStudent,
};

const { pool } = require('../config/db');

async function create({ teacher_id, subject_id, priority, lesson_date, lesson_time, total_copies, notes }) {
  const [result] = await pool.query(
    `INSERT INTO print_requests (teacher_id, subject_id, priority, lesson_date, lesson_time, total_copies, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [teacher_id, subject_id, priority, lesson_date, lesson_time || null, total_copies, notes || null]
  );
  return result.insertId;
}

async function addClasses(printRequestId, classes) {
  // classes: [{class_id, copies_count}]
  if (!classes.length) return;
  const values = classes.map(({ class_id, copies_count }) => [printRequestId, class_id, copies_count]);
  await pool.query('INSERT INTO print_request_classes (print_request_id, class_id, copies_count) VALUES ?', [values]);
}

async function addFile({ print_request_id, original_name, stored_name, file_path, file_size, mime_type }) {
  const [result] = await pool.query(
    `INSERT INTO print_files (print_request_id, original_name, stored_name, file_path, file_size, mime_type)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [print_request_id, original_name, stored_name, file_path, file_size, mime_type]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT pr.*, u.name AS teacher_name, s.name AS subject_name
     FROM print_requests pr
     JOIN users u ON u.id = pr.teacher_id
     JOIN subjects s ON s.id = pr.subject_id
     WHERE pr.id = ? LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;

  const request = rows[0];
  const [classes] = await pool.query(
    `SELECT prc.class_id, prc.copies_count, c.name AS class_name, c.student_count
     FROM print_request_classes prc
     JOIN classes c ON c.id = prc.class_id
     WHERE prc.print_request_id = ?`,
    [id]
  );
  const [files] = await pool.query(
    'SELECT * FROM print_files WHERE print_request_id = ?',
    [id]
  );
  request.classes = classes;
  request.files = files;
  return request;
}

async function findAll({ teacherId, priority, status, dateFrom, dateTo, page, limit, offset }) {
  let sql = `
    SELECT pr.id, pr.priority, pr.status, pr.lesson_date, pr.lesson_time,
           pr.total_copies, pr.notes, pr.created_at,
           u.name AS teacher_name, u.id AS teacher_id,
           s.name AS subject_name
    FROM print_requests pr
    JOIN users u ON u.id = pr.teacher_id
    JOIN subjects s ON s.id = pr.subject_id
    WHERE 1=1
  `;
  const params = [];

  if (teacherId) { sql += ' AND pr.teacher_id = ?'; params.push(teacherId); }
  if (priority) { sql += ' AND pr.priority = ?'; params.push(priority); }
  if (status) { sql += ' AND pr.status = ?'; params.push(status); }
  if (dateFrom) { sql += ' AND pr.lesson_date >= ?'; params.push(dateFrom); }
  if (dateTo) { sql += ' AND pr.lesson_date <= ?'; params.push(dateTo); }

  const countSql = sql.replace(
    /SELECT pr\.id.*FROM print_requests/,
    'SELECT COUNT(*) AS total FROM print_requests'
  );
  const [[{ total }]] = await pool.query(countSql, params);

  sql += ' ORDER BY FIELD(pr.priority,"urgent","important","normal"), pr.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query(sql, params);
  return { rows, total };
}

async function findByTeacher(teacherId, { page, limit, offset } = {}) {
  const [rows] = await pool.query(
    `SELECT pr.*, s.name AS subject_name
     FROM print_requests pr
     JOIN subjects s ON s.id = pr.subject_id
     WHERE pr.teacher_id = ?
     ORDER BY pr.created_at DESC
     LIMIT ? OFFSET ?`,
    [teacherId, limit || 20, offset || 0]
  );
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM print_requests WHERE teacher_id = ?',
    [teacherId]
  );
  return { rows, total };
}

async function updateStatus(id, status) {
  await pool.query('UPDATE print_requests SET status = ? WHERE id = ?', [status, id]);
}

async function createMerged({ teacher_id, subject_id, priority, lesson_date, lesson_time, total_copies, notes, merged_from }) {
  const [result] = await pool.query(
    `INSERT INTO print_requests (teacher_id, subject_id, priority, lesson_date, lesson_time, total_copies, notes, is_merged, merged_from)
     VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
    [teacher_id, subject_id, priority, lesson_date, lesson_time || null, total_copies, notes || null, JSON.stringify(merged_from)]
  );
  return result.insertId;
}

module.exports = { create, addClasses, addFile, findById, findAll, findByTeacher, updateStatus, createMerged };

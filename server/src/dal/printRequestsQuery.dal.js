const { pool } = require('../config/db');

async function findAll({ teacherId, priority, status, dateFrom, dateTo, page, limit, offset }) {
  let where = 'WHERE 1=1';
  const params = [];

  if (teacherId) { where += ' AND pr.teacher_id = ?';  params.push(teacherId); }
  if (priority)  { where += ' AND pp.code = ?';         params.push(priority); }
  if (status)    { where += ' AND ps.code = ?';         params.push(status); }
  if (dateFrom)  { where += ' AND pr.lesson_date >= ?'; params.push(dateFrom); }
  if (dateTo)    { where += ' AND pr.lesson_date <= ?'; params.push(dateTo); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM print_requests pr
     JOIN print_priorities pp ON pp.id = pr.priority_id
     JOIN print_statuses ps   ON ps.id = pr.status_id
     ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT pr.id, pr.lesson_date, pr.lesson_time, pr.total_copies, pr.notes, pr.created_at,
            u.name AS teacher_name, u.id AS teacher_id, s.name AS subject_name,
            pp.code AS priority, ps.code AS status
     FROM print_requests pr
     JOIN users u             ON u.id  = pr.teacher_id
     JOIN subjects s          ON s.id  = pr.subject_id
     JOIN print_priorities pp ON pp.id = pr.priority_id
     JOIN print_statuses ps   ON ps.id = pr.status_id
     ${where}
     ORDER BY pp.sort_order ASC, pr.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
}

async function findHistory({ priority, dateFrom, dateTo, search, page, limit, offset }) {
  let where = "WHERE ps.code = 'completed'";
  const params = [];
  if (priority) { where += ' AND pp.code = ?'; params.push(priority); }
  if (dateFrom) { where += ' AND pr.lesson_date >= ?'; params.push(dateFrom); }
  if (dateTo)   { where += ' AND pr.lesson_date <= ?'; params.push(dateTo); }
  if (search)   { where += ' AND (u.name LIKE ? OR s.name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM print_requests pr
     JOIN users u             ON u.id  = pr.teacher_id
     JOIN subjects s          ON s.id  = pr.subject_id
     JOIN print_priorities pp ON pp.id = pr.priority_id
     JOIN print_statuses ps   ON ps.id = pr.status_id
     ${where}`, params
  );

  const [rows] = await pool.query(
    `SELECT pr.id, pr.lesson_date, pr.total_copies, pr.notes, pr.created_at, pr.updated_at,
            u.name AS teacher_name, s.name AS subject_name, pp.code AS priority, ps.code AS status
     FROM print_requests pr
     JOIN users u             ON u.id  = pr.teacher_id
     JOIN subjects s          ON s.id  = pr.subject_id
     JOIN print_priorities pp ON pp.id = pr.priority_id
     JOIN print_statuses ps   ON ps.id = pr.status_id
     ${where}
     ORDER BY pr.updated_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
}

module.exports = { findAll, findHistory };

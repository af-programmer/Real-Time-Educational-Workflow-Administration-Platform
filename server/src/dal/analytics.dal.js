const { pool } = require('../config/db');

async function getGradesByClass() {
  const [rows] = await pool.query(`
    SELECT
      cl.name AS className,
      ROUND(AVG(g.grade / g.max_grade * 100), 1) AS averageGrade,
      COUNT(*) AS count
    FROM grades g
    JOIN students s  ON s.id  = g.student_id
    JOIN classes cl  ON cl.id = s.class_id
    WHERE g.max_grade > 0
    GROUP BY cl.id, cl.name
    ORDER BY cl.name ASC
  `);
  return rows;
}

async function getPrintRequestsByMonth() {
  const [rows] = await pool.query(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS requests
    FROM print_requests
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC
  `);
  return rows;
}

module.exports = { getGradesByClass, getPrintRequestsByMonth };

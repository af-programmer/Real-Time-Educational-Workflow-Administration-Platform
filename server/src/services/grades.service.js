const { pool } = require('../config/db');
const gradesDAL = require('../dal/grades.dal');
const teacherAssignmentsDAL = require('../dal/teacherAssignments.dal');
const classesDAL = require('../dal/classes.dal');
const AppError = require('../utils/AppError');

// Shared guard: verify a student belongs to one of the teacher's classes
async function assertStudentInTeacherClasses(teacherId, studentId) {
  const classes = await teacherAssignmentsDAL.getTeacherClasses(teacherId);
  const classIds = classes.map((c) => c.id);
  const [rows] = await pool.query(
    'SELECT id FROM students WHERE id = ? AND class_id IN (?) AND is_active = TRUE',
    [studentId, classIds.length ? classIds : [0]]
  );
  if (!rows.length) throw new AppError('Student not found in your classes.', 403);
  return classIds;
}

async function getMyClasses(teacherId) {
  const classes = await teacherAssignmentsDAL.getTeacherClasses(teacherId);
  return Promise.all(
    classes.map(async (cls) => ({ ...cls, students: await classesDAL.getStudentsByClass(cls.id) }))
  );
}

async function getMySubjects(teacherId) {
  return teacherAssignmentsDAL.getTeacherSubjects(teacherId);
}

async function getExamTypes() {
  return gradesDAL.getExamTypes();
}

async function createGrade(teacherId, { student_id, subject_id, exam_type_id, grade, max_grade, date, notes }) {
  const dateOnly = date ? date.toString().slice(0, 10) : date;

  const subjects = await teacherAssignmentsDAL.getTeacherSubjects(teacherId);
  if (!subjects.some((s) => s.id === parseInt(subject_id)))
    throw new AppError('You are not assigned to teach this subject.', 403);

  await assertStudentInTeacherClasses(teacherId, student_id);

  const gradeId = await gradesDAL.create({
    student_id, subject_id, teacher_id: teacherId,
    exam_type_id, grade, max_grade, date: dateOnly, notes,
  });
  return gradesDAL.findById(gradeId);
}

async function updateGrade(teacherId, gradeId, fields) {
  const owned = await gradesDAL.verifyTeacherOwnership(gradeId, teacherId);
  if (!owned) throw new AppError('Grade not found or access denied.', 403);
  await gradesDAL.update(gradeId, fields);
  return gradesDAL.findById(gradeId);
}

async function getGradesByTeacher(teacherId, filters) {
  return gradesDAL.findByTeacher(teacherId, filters);
}

async function getStudentGrades(studentId, requestingUser) {
  if (requestingUser.role === 'teacher') {
    const [taughtClasses, homeroomClasses] = await Promise.all([
      teacherAssignmentsDAL.getTeacherClasses(requestingUser.id),
      teacherAssignmentsDAL.getHomeroomClasses(requestingUser.id),
    ]);
    const allClassIds = [...new Set([
      ...taughtClasses.map((c) => c.id),
      ...homeroomClasses.map((c) => c.id),
    ])];
    const [rows] = await pool.query(
      'SELECT class_id FROM students WHERE id = ? AND class_id IN (?) AND is_active = TRUE',
      [studentId, allClassIds.length ? allClassIds : [0]]
    );
    if (!rows.length) throw new AppError('Student not found in your classes.', 403);

    // If student is in a homeroom class → show all subjects
    const studentClassId = rows[0].class_id;
    if (homeroomClasses.some((c) => c.id === studentClassId)) {
      return gradesDAL.findByStudent(studentId);
    }
    // Otherwise show only subjects this teacher teaches
    const subjects = await teacherAssignmentsDAL.getTeacherSubjects(requestingUser.id);
    return gradesDAL.findByStudent(studentId, subjects.map((s) => s.id));
  }
  return gradesDAL.findByStudent(studentId);
}

module.exports = { getMyClasses, getMySubjects, getExamTypes, createGrade, updateGrade, getGradesByTeacher, getStudentGrades };

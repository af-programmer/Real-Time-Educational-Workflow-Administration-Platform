const gradesDAL = require('../dal/grades.dal');
const usersDAL = require('../dal/users.dal');
const classesDAL = require('../dal/classes.dal');
const AppError = require('../utils/AppError');

async function getMyClasses(teacherId) {
  const classes = await usersDAL.getTeacherClasses(teacherId);
  const result = await Promise.all(
    classes.map(async (cls) => {
      const students = await classesDAL.getStudentsByClass(cls.id);
      return { ...cls, students };
    })
  );
  return result;
}

async function getMySubjects(teacherId) {
  return usersDAL.getTeacherSubjects(teacherId);
}

async function createGrade(teacherId, { student_id, subject_id, grade, max_grade, date, exam_type, notes }) {
  // Normalize date to YYYY-MM-DD (strip time if ISO string)
  const dateOnly = date ? date.toString().slice(0, 10) : date;
  // Verify teacher is assigned this subject
  const subjects = await usersDAL.getTeacherSubjects(teacherId);
  const hasSubject = subjects.some((s) => s.id === parseInt(subject_id));
  if (!hasSubject) throw new AppError('You are not assigned to teach this subject.', 403);

  // Verify student belongs to one of teacher's classes
  const classes = await usersDAL.getTeacherClasses(teacherId);
  const classIds = classes.map((c) => c.id);

  const [studentRows] = await require('../config/db').pool.query(
    'SELECT id, class_id FROM students WHERE id = ? AND class_id IN (?) AND is_active = TRUE',
    [student_id, classIds.length ? classIds : [0]]
  );
  if (!studentRows.length) throw new AppError('Student not found in your classes.', 403);

  const gradeId = await gradesDAL.create({
    student_id, subject_id, teacher_id: teacherId,
    grade, max_grade, date: dateOnly, exam_type, notes,
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
    // Verify teacher has access to this student
    const classes = await usersDAL.getTeacherClasses(requestingUser.id);
    const classIds = classes.map((c) => c.id);
    const [studentRows] = await require('../config/db').pool.query(
      'SELECT id FROM students WHERE id = ? AND class_id IN (?)',
      [studentId, classIds.length ? classIds : [0]]
    );
    if (!studentRows.length) throw new AppError('Student not found in your classes.', 403);
  }
  return gradesDAL.findByStudent(studentId);
}

module.exports = { getMyClasses, getMySubjects, createGrade, updateGrade, getGradesByTeacher, getStudentGrades };

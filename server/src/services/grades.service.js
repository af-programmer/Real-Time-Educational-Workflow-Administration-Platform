const gradesDAL = require('../dal/grades.dal');
const teacherAssignmentsDAL = require('../dal/teacherAssignments.dal');
const classesDAL = require('../dal/classes.dal');
const AppError = require('../utils/AppError');

async function assertStudentInTeacherClasses(teacherId, studentId) {
  const classes = await teacherAssignmentsDAL.getTeacherClasses(teacherId);
  const classIds = classes.map((c) => c.id);
  const rows = await gradesDAL.findStudentInClasses(studentId, classIds);
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
  if (requestingUser.role === 'Educator') {
    const homeroomClasses = await teacherAssignmentsDAL.getHomeroomClasses(requestingUser.id);
    const classIds = homeroomClasses.map((c) => c.id);
    const rows = await gradesDAL.findStudentInClasses(studentId, classIds);
    if (!rows.length) throw new AppError('Student not found in your classes.', 403);
    return gradesDAL.findByStudent(studentId);
  }
  if (requestingUser.role === 'teacher') {
    await assertStudentInTeacherClasses(requestingUser.id, studentId);
    const subjects = await teacherAssignmentsDAL.getTeacherSubjects(requestingUser.id);
    return gradesDAL.findByStudent(studentId, subjects.map((s) => s.id));
  }
  return gradesDAL.findByStudent(studentId);
}

module.exports = { getMyClasses, getMySubjects, getExamTypes, createGrade, updateGrade, getGradesByTeacher, getStudentGrades };

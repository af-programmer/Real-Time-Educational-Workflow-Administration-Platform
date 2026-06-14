const classesDAL = require('../dal/classes.dal');
const teacherAssignmentsDAL = require('../dal/teacherAssignments.dal');
const AppError = require('../utils/AppError');

async function getAllClasses() {
  return classesDAL.findAll();
}

async function getClassWithStudents(id) {
  const cls = await classesDAL.findById(id);
  if (!cls) throw new AppError('Class not found.', 404);
  const students = await classesDAL.getStudentsByClass(cls.id);
  return { ...cls, students };
}

async function getTeacherClassIds(userId) {
  return Promise.all([
    teacherAssignmentsDAL.getHomeroomClasses(userId),
    teacherAssignmentsDAL.getTeacherClasses(userId),
  ]);
}

async function getStudentsByClass(classId) {
  return classesDAL.getStudentsByClass(classId);
}

async function getStudentById(studentId) {
  const student = await classesDAL.findStudentById(studentId);
  if (!student) throw new AppError('Student not found.', 404);
  return student;
}

async function createStudent(data) {
  const id = await classesDAL.createStudent(data);
  return classesDAL.findStudentById(id);
}

async function updateStudent(studentId, data) {
  const student = await classesDAL.findStudentById(studentId);
  if (!student) throw new AppError('Student not found.', 404);
  await classesDAL.updateStudent(studentId, data);
  return classesDAL.findStudentById(studentId);
}

async function deleteStudent(studentId) {
  const student = await classesDAL.findStudentById(studentId);
  if (!student) throw new AppError('Student not found.', 404);
  await classesDAL.deleteStudent(studentId);
}

module.exports = { getAllClasses, getClassWithStudents, getTeacherClassIds, getStudentsByClass, getStudentById, createStudent, updateStudent, deleteStudent };

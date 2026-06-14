const classesService = require('../services/classes.service');
const asyncWrapper = require('../utils/asyncWrapper');

const TEACHER_ROLES = ['teacher', 'Educator'];

const getAll = asyncWrapper(async (req, res) => {
  const classes = await classesService.getAllClasses();
  res.json({ success: true, data: classes });
});

const getById = asyncWrapper(async (req, res) => {
  const cls = await classesService.getClassWithStudents(req.params.id);
  res.json({ success: true, data: cls });
});

const authorizeClassAccess = asyncWrapper(async (req, res, next) => {
  const { role, id: userId } = req.user;
  if (role === 'secretary' || role === 'admin') return next();
  if (TEACHER_ROLES.includes(role)) {
    const classId = parseInt(req.params.id);
    const [homeroom, teaching] = await classesService.getTeacherClassIds(userId);
    if (homeroom.some((c) => c.id === classId) || teaching.some((c) => c.id === classId)) {
      return next();
    }
  }
  return res.status(403).json({ success: false, message: 'Access denied.' });
});

const getStudents = asyncWrapper(async (req, res) => {
  const students = await classesService.getStudentsByClass(req.params.id);
  res.json({ success: true, data: students });
});

const getStudent = asyncWrapper(async (req, res) => {
  const student = await classesService.getStudentById(req.params.studentId);
  res.json({ success: true, data: student });
});

const createStudent = asyncWrapper(async (req, res) => {
  const student = await classesService.createStudent(req.body);
  res.status(201).json({ success: true, data: student });
});

const updateStudent = asyncWrapper(async (req, res) => {
  const student = await classesService.updateStudent(req.params.studentId, req.body);
  res.json({ success: true, data: student });
});

const deleteStudent = asyncWrapper(async (req, res) => {
  await classesService.deleteStudent(req.params.studentId);
  res.json({ success: true });
});

module.exports = { getAll, getById, authorizeClassAccess, getStudents, getStudent, createStudent, updateStudent, deleteStudent };

const classesDAL = require('../dal/classes.dal');
const asyncWrapper = require('../utils/asyncWrapper');

const getAll = asyncWrapper(async (req, res) => {
  const classes = await classesDAL.findAll();
  res.json({ success: true, data: classes });
});

const getById = asyncWrapper(async (req, res) => {
  const cls = await classesDAL.findById(req.params.id);
  if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
  const students = await classesDAL.getStudentsByClass(cls.id);
  res.json({ success: true, data: { ...cls, students } });
});

const getStudents = asyncWrapper(async (req, res) => {
  const students = await classesDAL.getStudentsByClass(req.params.id);
  res.json({ success: true, data: students });
});

const getStudent = asyncWrapper(async (req, res) => {
  const student = await classesDAL.findStudentById(req.params.studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, data: student });
});

const createStudent = asyncWrapper(async (req, res) => {
  const id = await classesDAL.createStudent(req.body);
  const student = await classesDAL.findStudentById(id);
  res.status(201).json({ success: true, data: student });
});

const updateStudent = asyncWrapper(async (req, res) => {
  const student = await classesDAL.findStudentById(req.params.studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  await classesDAL.updateStudent(req.params.studentId, req.body);
  const updated = await classesDAL.findStudentById(req.params.studentId);
  res.json({ success: true, data: updated });
});

module.exports = { getAll, getById, getStudents, getStudent, createStudent, updateStudent };

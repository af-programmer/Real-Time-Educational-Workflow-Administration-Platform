const gradesService = require('../services/grades.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getMyClasses = asyncWrapper(async (req, res) => {
  const data = await gradesService.getMyClasses(req.user.id);
  res.json({ success: true, data });
});

const getMySubjects = asyncWrapper(async (req, res) => {
  const data = await gradesService.getMySubjects(req.user.id);
  res.json({ success: true, data });
});

const createGrade = asyncWrapper(async (req, res) => {
  const grade = await gradesService.createGrade(req.user.id, req.body);
  res.status(201).json({ success: true, data: grade });
});

const updateGrade = asyncWrapper(async (req, res) => {
  const grade = await gradesService.updateGrade(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: grade });
});

const getMyGrades = asyncWrapper(async (req, res) => {
  const { classId, subjectId } = req.query;
  const data = await gradesService.getGradesByTeacher(req.user.id, { classId, subjectId });
  res.json({ success: true, data });
});

const getStudentGrades = asyncWrapper(async (req, res) => {
  const data = await gradesService.getStudentGrades(req.params.studentId, req.user);
  res.json({ success: true, data });
});

const getExamTypes = asyncWrapper(async (req, res) => {
  const data = await gradesService.getExamTypes();
  res.json({ success: true, data });
});

module.exports = { getMyClasses, getMySubjects, getExamTypes, createGrade, updateGrade, getMyGrades, getStudentGrades };

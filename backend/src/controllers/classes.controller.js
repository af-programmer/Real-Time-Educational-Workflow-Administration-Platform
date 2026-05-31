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

module.exports = { getAll, getById };

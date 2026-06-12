const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const teacherAssignmentsDAL = require('../dal/teacherAssignments.dal');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

router.get('/', classesController.getAll);
router.get('/:id', classesController.getById);

// Admin/secretary: full access; teachers: own homeroom OR assigned teaching class
router.get('/:id/students', asyncWrapper(async (req, res, next) => {
  const { role, id: userId } = req.user;
  if (role === 'secretary' || role === 'admin') return next();
  if (role === 'teacher') {
    const classId = parseInt(req.params.id);
    const [homeroom, teaching] = await Promise.all([
      teacherAssignmentsDAL.getHomeroomClasses(userId),
      teacherAssignmentsDAL.getTeacherClasses(userId),
    ]);
    if (homeroom.some((c) => c.id === classId) || teaching.some((c) => c.id === classId)) {
      return next();
    }
  }
  return res.status(403).json({ success: false, message: 'Access denied.' });
}), classesController.getStudents);

// Student management - secretary + admin only
router.post('/students', requireRoles('secretary', 'admin'), classesController.createStudent);
router.get('/students/:studentId', requireRoles('secretary', 'admin'), classesController.getStudent);
router.put('/students/:studentId', requireRoles('secretary', 'admin'), classesController.updateStudent);
router.delete('/students/:studentId', requireRoles('secretary', 'admin'), classesController.deleteStudent);

module.exports = router;

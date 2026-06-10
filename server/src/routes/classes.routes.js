const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const usersDAL = require('../dal/users.dal');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

router.get('/', classesController.getAll);
router.get('/:id', classesController.getById);

// Homeroom teachers can view their own class students; secretary/admin can view any
router.get('/:id/students', asyncWrapper(async (req, res, next) => {
  const { role, id: userId } = req.user;
  if (role === 'secretary' || role === 'admin') return next();
  if (role === 'teacher') {
    const homeroom = await usersDAL.getHomeroomClasses(userId);
    if (homeroom.some((c) => c.id === parseInt(req.params.id))) return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied.' });
}), classesController.getStudents);

// Student management - secretary + admin only
router.post('/students', requireRoles('secretary', 'admin'), classesController.createStudent);
router.get('/students/:studentId', requireRoles('secretary', 'admin'), classesController.getStudent);
router.put('/students/:studentId', requireRoles('secretary', 'admin'), classesController.updateStudent);
router.delete('/students/:studentId', requireRoles('secretary', 'admin'), classesController.deleteStudent);

module.exports = router;

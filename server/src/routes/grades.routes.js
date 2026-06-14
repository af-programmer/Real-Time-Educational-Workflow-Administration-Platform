const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createGradeSchema, updateGradeSchema } = require('../validators/grade.validator');

router.use(authMiddleware);

router.get('/my-classes',  requireRoles('teacher', 'Educator'), gradesController.getMyClasses);
router.get('/my-subjects', requireRoles('teacher', 'Educator'), gradesController.getMySubjects);
router.get('/exam-types',  requireRoles('teacher', 'Educator'), gradesController.getExamTypes);
router.get('/mine',        requireRoles('teacher', 'Educator'), gradesController.getMyGrades);
router.post('/',           requireRoles('teacher', 'Educator'), validate(createGradeSchema), gradesController.createGrade);
router.put('/:id',         requireRoles('teacher', 'Educator'), validate(updateGradeSchema), gradesController.updateGrade);
router.get('/student/:studentId', requireRoles('teacher', 'Educator', 'admin', 'secretary'), gradesController.getStudentGrades);

module.exports = router;

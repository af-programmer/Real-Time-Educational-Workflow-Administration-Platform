const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createGradeSchema, updateGradeSchema } = require('../validators/grade.validator');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

router.get('/my-classes', requireRoles('teacher'), gradesController.getMyClasses);
router.get('/my-subjects', requireRoles('teacher'), gradesController.getMySubjects);
router.get('/exam-types', requireRoles('teacher'), gradesController.getExamTypes);
router.get('/mine', requireRoles('teacher'), gradesController.getMyGrades);
router.post('/', requireRoles('teacher'), validate(createGradeSchema), gradesController.createGrade);
router.put('/:id', requireRoles('teacher'), validate(updateGradeSchema), gradesController.updateGrade);
router.get('/student/:studentId', requireRoles('teacher', 'admin', 'secretary'), gradesController.getStudentGrades);


module.exports = router;

const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', classesController.getAll);
router.get('/:id', classesController.getById);

module.exports = router;

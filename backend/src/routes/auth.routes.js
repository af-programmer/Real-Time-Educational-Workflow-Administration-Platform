const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { loginSchema, resetPasswordSchema } = require('../validators/auth.validator');

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/reset-password', authMiddleware, requireRoles('admin'), validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authMiddleware, authController.me);

module.exports = router;

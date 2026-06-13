const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

router.use(authMiddleware);
router.use(requireRoles('admin'));

router.get('/grades', analyticsController.getGradesAnalytics);
router.get('/print-requests', analyticsController.getPrintRequestsAnalytics);

module.exports = router;

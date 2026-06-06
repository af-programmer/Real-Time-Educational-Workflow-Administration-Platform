const express = require('express');
const router = express.Router();
const printRequestsController = require('../controllers/printRequests.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { updateStatusSchema } = require('../validators/printRequest.validator');

router.use(authMiddleware);

router.get('/mine', requireRoles('teacher'), printRequestsController.getMine);
router.post('/', requireRoles('teacher'), handleUpload('files', 5), printRequestsController.create);
router.get('/history', requireRoles('secretary', 'admin'), printRequestsController.getHistory);
router.get('/', requireRoles('secretary', 'admin'), printRequestsController.getAll);
router.get('/:id', requireRoles('teacher', 'secretary', 'admin'), printRequestsController.getById);
router.patch('/:id/status', requireRoles('secretary', 'admin'), validate(updateStatusSchema), printRequestsController.updateStatus);
router.get('/:id/cover', requireRoles('secretary', 'admin'), printRequestsController.getCover);
router.delete('/:id', requireRoles('secretary', 'admin'), printRequestsController.remove);

module.exports = router;

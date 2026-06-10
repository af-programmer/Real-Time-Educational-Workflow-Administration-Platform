const printRequestsService = require('../services/printRequests.service');
const printCoverService = require('../services/printCover.service');
const asyncWrapper = require('../utils/asyncWrapper');

const create = asyncWrapper(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (typeof req.body.class_ids === 'string') {
    req.body.class_ids = JSON.parse(req.body.class_ids);
  }
  if (req.body.lesson_date) {
    req.body.lesson_date = req.body.lesson_date.toString().slice(0, 10);
  }
  const request = await printRequestsService.createPrintRequest(req.user.id, req.body, files);

  const isUrgent = req.body.priority === 'urgent';
  const notifNS = req.app.locals.notifNS;
  if (notifNS) {
    const payload = {
      type:       isUrgent ? 'urgent_request' : 'print_request',
      title:      isUrgent ? '🚨 Urgent Print Request' : '🖨️ New Print Request',
      content:    `New ${req.body.priority || 'normal'} print request submitted.`,
      created_at: new Date().toISOString(),
    };
    notifNS.to('role:secretary').emit('notification', payload);
  }

  res.status(201).json({ success: true, data: request });
});

const getMine = asyncWrapper(async (req, res) => {
  const result = await printRequestsService.getMyRequests(req.user.id, req.query);
  res.json({ success: true, ...result });
});

const getAll = asyncWrapper(async (req, res) => {
  const { teacherId, priority, status, dateFrom, dateTo, page, limit } = req.query;
  const result = await printRequestsService.getAllRequests({ teacherId, priority, status, dateFrom, dateTo, page, limit });
  res.json({ success: true, ...result });
});

const updateStatus = asyncWrapper(async (req, res) => {
  const request = await printRequestsService.updateStatus(req.params.id, req.body.status);

  if (req.body.status === 'completed') {
    const notifNS = req.app.locals.notifNS;
    if (notifNS && request.teacher_id) {
      notifNS.to(`user:${request.teacher_id}`).emit('notification', {
        type: 'print_completed',
        title: '✅ Print Request Completed',
        content: 'Your print request has been marked as completed.',
      });
    }
  }

  res.json({ success: true, data: request });
});

const getById = asyncWrapper(async (req, res) => {
  const request = await printRequestsService.getRequestById(req.params.id);
  res.json({ success: true, data: request });
});

const getCover = asyncWrapper(async (req, res) => {
  await printCoverService.generateCoverPage(req.params.id, res);
});

const remove = asyncWrapper(async (req, res) => {
  await printRequestsService.deleteRequest(req.params.id, req.user.id, req.user.role);
  res.json({ success: true, message: 'Print request deleted.' });
});

const getHistory = asyncWrapper(async (req, res) => {
  const { priority, dateFrom, dateTo, search, page, limit } = req.query;
  const result = await printRequestsService.getHistory({ priority, dateFrom, dateTo, search, page, limit });
  res.json({ success: true, ...result });
});

module.exports = { create, getMine, getAll, updateStatus, getById, getCover, remove, getHistory };

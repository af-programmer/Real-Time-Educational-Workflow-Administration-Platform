const printRequestsService = require('../services/printRequests.service');
const printCoverService = require('../services/printCover.service');
const asyncWrapper = require('../utils/asyncWrapper');

const create = asyncWrapper(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  // class_ids comes as JSON string in FormData
  if (typeof req.body.class_ids === 'string') {
    req.body.class_ids = JSON.parse(req.body.class_ids);
  }
  const request = await printRequestsService.createPrintRequest(req.user.id, req.body, files);
  res.status(201).json({ success: true, data: request });
});

const getMine = asyncWrapper(async (req, res) => {
  const result = await printRequestsService.getMyRequests(req.user.id, req.query);
  res.json({ success: true, ...result });
});

const getAll = asyncWrapper(async (req, res) => {
  const { teacherId, priority, status, dateFrom, dateTo, page, limit } = req.query;
  const result = await printRequestsService.getAllRequests({
    teacherId, priority, status, dateFrom, dateTo, page, limit,
  });
  res.json({ success: true, ...result });
});

const updateStatus = asyncWrapper(async (req, res) => {
  const request = await printRequestsService.updateStatus(req.params.id, req.body.status);
  res.json({ success: true, data: request });
});

const getById = asyncWrapper(async (req, res) => {
  const request = await printRequestsService.getRequestById(req.params.id);
  res.json({ success: true, data: request });
});

const getCover = asyncWrapper(async (req, res) => {
  await printCoverService.generateCoverPage(req.params.id, res);
});

const merge = asyncWrapper(async (req, res) => {
  const { requestIds, notes } = req.body;
  const merged = await printRequestsService.mergeRequests(requestIds, notes);
  res.status(201).json({ success: true, data: merged });
});

module.exports = { create, getMine, getAll, updateStatus, getById, getCover, merge };

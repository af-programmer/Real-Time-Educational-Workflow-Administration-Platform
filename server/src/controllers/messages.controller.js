const messagesService = require('../services/messages.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getInbox = asyncWrapper(async (req, res) => {
  const messages = await messagesService.getInbox(req.user.id, req.user.role);
  res.json({ success: true, data: messages });
});

const send = asyncWrapper(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.recipient_ids === 'string') body.recipient_ids = JSON.parse(body.recipient_ids);
  const ids = await messagesService.sendMessage(req.user.id, body, req.app, req.file);
  res.status(201).json({ success: true, data: { ids } });
});

const markRead = asyncWrapper(async (req, res) => {
  await messagesService.markRead(req.params.id, req.user.id);
  res.json({ success: true });
});

const deleteMessage = asyncWrapper(async (req, res) => {
  await messagesService.deleteMessage(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = { getInbox, send, markRead, deleteMessage };

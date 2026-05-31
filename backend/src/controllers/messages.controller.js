const messagesService = require('../services/messages.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getInbox = asyncWrapper(async (req, res) => {
  const messages = await messagesService.getInbox(req.user.id, req.user.role);
  res.json({ success: true, data: messages });
});

const send = asyncWrapper(async (req, res) => {
  const messageId = await messagesService.sendMessage(req.user.id, req.body);
  res.status(201).json({ success: true, data: { id: messageId } });
});

const broadcast = asyncWrapper(async (req, res) => {
  const messageId = await messagesService.broadcastMessage(req.user.id, req.body);
  res.status(201).json({ success: true, data: { id: messageId } });
});

const markRead = asyncWrapper(async (req, res) => {
  await messagesService.markRead(req.params.id, req.user.id);
  res.json({ success: true, message: 'Message marked as read.' });
});

module.exports = { getInbox, send, broadcast, markRead };

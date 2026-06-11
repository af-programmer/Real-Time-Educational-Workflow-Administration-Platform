const messagesDAL = require('../dal/messages.dal');
const usersDAL = require('../dal/users.dal');
const notificationsDAL = require('../dal/notifications.dal');
const AppError = require('../utils/AppError');

function emitNotification(app, rooms, payload) {
  const notifNS = app?.locals?.notifNS;
  if (!notifNS) return;
  rooms.forEach((room) => notifNS.to(room).emit('notification', payload));
}

function buildNotificationPayload(messageId, subject, body) {
  return {
    id: Date.now(),
    type: 'message',
    title: subject || 'New Message',
    content: body.substring(0, 100),
    data: { entity_id: messageId, entity_type: 'message' },
    is_read: false,
    created_at: new Date().toISOString(),
  };
}

async function getInbox(userId, role) {
  return messagesDAL.findInbox(userId, role);
}

async function sendMessage(senderId, { recipient_id, subject, body }, app, file) {
  if (!recipient_id) throw new AppError('recipient_id is required.', 400);

  const recipient = await usersDAL.findById(recipient_id);
  if (!recipient) throw new AppError('Recipient not found.', 404);

  const sender = await usersDAL.findById(senderId);

  const messageId = await messagesDAL.create({
    sender_id: senderId, recipient_id, recipient_role: null, subject, body, is_broadcast: false,
    attachment_path: file?.filename || null,
    attachment_name: file?.originalname || null,
  });

  const payload = buildNotificationPayload(messageId, subject, body);

  await notificationsDAL.create({
    user_id: recipient_id,
    type: payload.type,
    title: payload.title,
    content: payload.content,
    data: payload.data,
  });

  emitNotification(app, [`user:${recipient_id}`], payload);
  return messageId;
}

async function markRead(messageId, userId) {
  await messagesDAL.markRead(messageId, userId);
}

async function deleteMessage(messageId, userId) {
  await messagesDAL.deleteForUser(messageId, userId);
}

module.exports = { getInbox, sendMessage, markRead, deleteMessage };

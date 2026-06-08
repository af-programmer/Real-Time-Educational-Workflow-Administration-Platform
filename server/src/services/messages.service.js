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

async function sendMessage(senderId, { recipient_id, subject, body }, app) {
  if (!recipient_id) throw new AppError('recipient_id is required.', 400);

  const recipient = await usersDAL.findById(recipient_id);
  if (!recipient) throw new AppError('Recipient not found.', 404);

  const messageId = await messagesDAL.create({
    sender_id: senderId, recipient_id, recipient_role: null, subject, body, is_broadcast: false,
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

async function broadcastMessage(senderId, { recipient_role, subject, body }, app) {
  const validRoles = ['all', 'all_teachers', 'all_secretaries', 'admin', 'secretary', 'teacher'];
  if (!validRoles.includes(recipient_role))
    throw new AppError('Invalid recipient role for broadcast.', 400);

  const messageId = await messagesDAL.create({
    sender_id: senderId, recipient_id: null, recipient_role, subject, body, is_broadcast: true,
  });

  const roleTarget =
    recipient_role === 'all_teachers'    ? 'teacher'   :
    recipient_role === 'all_secretaries' ? 'secretary' :
    recipient_role;

  const rooms = roleTarget === 'all'
    ? ['role:admin', 'role:secretary', 'role:teacher']
    : [`role:${roleTarget}`];

  emitNotification(app, rooms, buildNotificationPayload(messageId, subject, body));
  return messageId;
}

async function markRead(messageId, userId) {
  await messagesDAL.markRead(messageId, userId);
}

async function deleteMessage(messageId, userId) {
  await messagesDAL.deleteForUser(messageId, userId);
}

module.exports = { getInbox, sendMessage, broadcastMessage, markRead, deleteMessage };

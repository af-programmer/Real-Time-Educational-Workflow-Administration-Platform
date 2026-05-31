const messagesDAL = require('../dal/messages.dal');
const usersDAL = require('../dal/users.dal');
const notificationsDAL = require('../dal/notifications.dal');
const AppError = require('../utils/AppError');

async function getInbox(userId, role) {
  return messagesDAL.findInbox(userId, role);
}

async function sendMessage(senderId, { recipient_id, recipient_role, subject, body }) {
  if (!recipient_id && !recipient_role) {
    throw new AppError('Either recipient_id or recipient_role must be provided.', 400);
  }

  if (recipient_id) {
    const recipient = await usersDAL.findById(recipient_id);
    if (!recipient) throw new AppError('Recipient not found.', 404);
  }

  const messageId = await messagesDAL.create({
    sender_id: senderId,
    recipient_id: recipient_id || null,
    recipient_role: recipient_role || null,
    subject,
    body,
    is_broadcast: false,
  });

  // Create notification
  const notifPayload = {
    type: 'message',
    title: 'New Message',
    content: subject || body.substring(0, 80),
    entity_id: messageId,
    entity_type: 'message',
  };
  if (recipient_id) notifPayload.user_id = recipient_id;
  else notifPayload.role_target = recipient_role;
  await notificationsDAL.create(notifPayload);

  return messageId;
}

async function broadcastMessage(senderId, { recipient_role, subject, body }) {
  const validRoles = ['all', 'all_teachers', 'all_secretaries', 'admin', 'secretary', 'teacher'];
  if (!validRoles.includes(recipient_role)) {
    throw new AppError('Invalid recipient role for broadcast.', 400);
  }

  const messageId = await messagesDAL.create({
    sender_id: senderId,
    recipient_id: null,
    recipient_role,
    subject,
    body,
    is_broadcast: true,
  });

  await notificationsDAL.create({
    role_target: recipient_role === 'all_teachers' ? 'teacher' : recipient_role === 'all_secretaries' ? 'secretary' : recipient_role,
    type: 'announcement',
    title: subject || 'Broadcast Message',
    content: body.substring(0, 100),
    entity_id: messageId,
    entity_type: 'message',
  });

  return messageId;
}

async function markRead(messageId, userId) {
  await messagesDAL.markRead(messageId, userId);
}

module.exports = { getInbox, sendMessage, broadcastMessage, markRead };

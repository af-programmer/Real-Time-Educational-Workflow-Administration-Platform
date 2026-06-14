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

async function sendMessage(senderId, { recipient_ids, recipient_role, subject, body }, app, file) {
  // Support sending to explicit recipient IDs or to a recipient role (e.g. 'all_teachers')
  if ((!recipient_ids || !recipient_ids.length) && !recipient_role) throw new AppError('At least one recipient is required.', 400);

  const messageIds = [];

  // Case A: broadcast to a role/target (single message stored with recipient_role)
  if (recipient_role) {
    const messageId = await messagesDAL.create({
      sender_id: senderId,
      recipient_id: null,
      recipient_role,
      subject,
      body,
      attachment_path: file?.filename || null,
      attachment_name: file?.originalname || null,
    });

    const payload = buildNotificationPayload(messageId, subject, body);
    // create a role-targeted notification (notifications.dal will handle role_target semantics)
    await notificationsDAL.create({ role_target: recipient_role, type: payload.type, title: payload.title, content: payload.content, data: payload.data });

    // Emit to socket rooms that correspond to the targeted users
    const rooms = [];
    if (recipient_role === 'all_teachers') {
      rooms.push('role:teacher', 'role:Educator');
    } else if (recipient_role === 'all_secretaries') {
      rooms.push('role:secretary');
    } else if (recipient_role === 'all') {
      // broadcast to all role rooms (best-effort)
      rooms.push('role:admin', 'role:secretary', 'role:teacher', 'role:Educator');
    } else {
      // direct role name (e.g. 'Educator' or 'teacher') → emit to that role room
      rooms.push(`role:${recipient_role}`);
    }

    emitNotification(app, rooms, payload);
    messageIds.push(messageId);
    return messageIds;
  }

  // Case B: explicit recipient IDs
  for (const recipient_id of recipient_ids) {
    const recipient = await usersDAL.findById(recipient_id);
    if (!recipient) continue;

    const messageId = await messagesDAL.create({
      sender_id: senderId, recipient_id, recipient_role: null, subject, body,
      attachment_path: file?.filename || null,
      attachment_name: file?.originalname || null,
    });

    const payload = buildNotificationPayload(messageId, subject, body);
    await notificationsDAL.create({
      user_id: recipient_id, type: payload.type, title: payload.title,
      content: payload.content, data: payload.data,
    });
    emitNotification(app, [`user:${recipient_id}`], payload);
    messageIds.push(messageId);
  }

  if (!messageIds.length) throw new AppError('No valid recipients found.', 400);
  return messageIds;
}

async function markRead(messageId, userId) {
  await messagesDAL.markRead(messageId, userId);
}

async function deleteMessage(messageId, userId) {
  await messagesDAL.deleteForUser(messageId, userId);
}

module.exports = { getInbox, sendMessage, markRead, deleteMessage };

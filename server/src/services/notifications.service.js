const notificationsDAL = require('../dal/notifications.dal');

const PAGE_SIZE = 10;

async function getNotifications(userId, role, isHomeroom, { limit = PAGE_SIZE, offset = 0 } = {}) {
  const rows = await notificationsDAL.findByUser(userId, role, isHomeroom, { limit: limit + 1, offset });
  const hasMore = rows.length > limit;
  return { notifications: rows.slice(0, limit), hasMore };
}

async function markAllRead(userId, role, isHomeroom) {
  await notificationsDAL.markAllRead(userId, role, isHomeroom);
}

async function markOneRead(notificationId, userId) {
  await notificationsDAL.markOneRead(notificationId, userId);
}

async function getUnreadCount(userId, role, isHomeroom) {
  return notificationsDAL.getUnreadCount(userId, role, isHomeroom);
}

async function createAnnouncement(title, content, targetRole = 'all') {
  return notificationsDAL.create({
    role_target: targetRole,
    type: 'announcement',
    title,
    content,
  });
}

module.exports = { getNotifications, markAllRead, markOneRead, getUnreadCount, createAnnouncement };

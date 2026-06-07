const notificationsDAL = require('../dal/notifications.dal');

async function getNotifications(userId, role) {
  return notificationsDAL.findByUser(userId, role);
}

async function markAllRead(userId, role) {
  await notificationsDAL.markAllRead(userId, role);
}

async function markOneRead(notificationId, userId) {
  await notificationsDAL.markOneRead(notificationId, userId);
}

async function getUnreadCount(userId, role) {
  return notificationsDAL.getUnreadCount(userId, role);
}

async function createAnnouncement(title, content, targetRole = 'all') {
  return notificationsDAL.create({
    role_target: targetRole,
    type: 'announcement',
    title,
    content,
  });
}

module.exports = { getNotifications, markAllRead, getUnreadCount, createAnnouncement };

const notificationsService = require('../services/notifications.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getAll = asyncWrapper(async (req, res) => {
  const notifications = await notificationsService.getNotifications(req.user.id, req.user.role);
  const unread = await notificationsService.getUnreadCount(req.user.id, req.user.role);
  res.json({ success: true, data: notifications, unreadCount: unread });
});

const markAllRead = asyncWrapper(async (req, res) => {
  await notificationsService.markAllRead(req.user.id, req.user.role);
  res.json({ success: true });
});

const markOneRead = asyncWrapper(async (req, res) => {
  await notificationsService.markOneRead(req.params.id, req.user.id);
  res.json({ success: true });
});

const createAnnouncement = asyncWrapper(async (req, res) => {
  const { title, content, targetRole } = req.body;
  const id = await notificationsService.createAnnouncement(title, content, targetRole);

  const notifNS = req.app.locals.notifNS;
  if (notifNS) {
    const payload = { id, type: 'announcement', title, content };
    if (!targetRole || targetRole === 'all') {
      notifNS.emit('notification', payload);
    } else {
      notifNS.to(`role:${targetRole}`).emit('notification', payload);
    }
  }

  res.status(201).json({ success: true, data: { id } });
});

module.exports = { getAll, markAllRead, markOneRead, createAnnouncement };

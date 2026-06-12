const notificationsService = require('../services/notifications.service');
const asyncWrapper = require('../utils/asyncWrapper');

const PAGE_SIZE = 10;

const getAll = asyncWrapper(async (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  || PAGE_SIZE, 10), 50);
  const offset = Math.max(parseInt(req.query.offset || 0,         10), 0);
  const { notifications, hasMore } = await notificationsService.getNotifications(
    req.user.id, req.user.role, req.user.is_homeroom, { limit, offset }
  );
  const unread = await notificationsService.getUnreadCount(req.user.id, req.user.role, req.user.is_homeroom);
  res.json({ success: true, data: notifications, unreadCount: unread, hasMore });
});

const markAllRead = asyncWrapper(async (req, res) => {
  await notificationsService.markAllRead(req.user.id, req.user.role, req.user.is_homeroom);
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
    const payload = { id, type: 'announcement', title, content, created_at: new Date().toISOString() };
    const adminUserId = req.user.id;
    if (!targetRole || targetRole === 'all') {
      notifNS.except(`user:${adminUserId}`).emit('notification', payload);
    } else if (targetRole === 'professional_teacher') {
      notifNS.to('role:professional_teacher').except(`user:${adminUserId}`).emit('notification', payload);
    } else if (targetRole === 'homeroom_teacher') {
      notifNS.to('role:homeroom_teacher').except(`user:${adminUserId}`).emit('notification', payload);
    } else if (targetRole === 'all_teachers') {
      notifNS.to('role:teacher').except(`user:${adminUserId}`).emit('notification', payload);
    } else if (targetRole === 'all_secretaries') {
      notifNS.to('role:secretary').except(`user:${adminUserId}`).emit('notification', payload);
    } else {
      notifNS.to(`role:${targetRole}`).except(`user:${adminUserId}`).emit('notification', payload);
    }
  }

  res.status(201).json({ success: true, data: { id } });
});

module.exports = { getAll, markAllRead, markOneRead, createAnnouncement };

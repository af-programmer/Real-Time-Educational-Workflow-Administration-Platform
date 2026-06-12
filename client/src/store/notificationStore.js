import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  hasMore: false,

  setNotifications: (notifications, unreadCount, hasMore = false) =>
    set({ notifications, unreadCount, hasMore }),

  appendNotifications: (more, hasMore = false) =>
    set((state) => ({
      notifications: [...state.notifications, ...more],
      hasMore,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  markOneRead: (id) =>
    set((state) => {
      const wasUnread = state.notifications.find((n) => n.id === id && !n.is_read);
      return {
        notifications: state.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),

  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useNotificationStore;

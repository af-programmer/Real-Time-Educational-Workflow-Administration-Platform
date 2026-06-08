import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import toast from 'react-hot-toast';
import { notificationsApi } from '../api/notificationsApi';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, token, isAuthenticated } = useAuthStore();
  const { setNotifications, addNotification } = useNotificationStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Load initial notifications
    notificationsApi.getAll().then(({ data }) => {
      const list = data?.data;
      setNotifications(Array.isArray(list) ? list : [], data?.unreadCount || 0);
    }).catch(() => {});

    // Connect Socket.io
    socketRef.current = io('http://localhost:5000/notifications', {
      auth: { userId: user.id, role: user.role },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('notification', (notification) => {
      // 'message' type = broadcast/direct message → toast only, not notification center
      if (notification.type !== 'message') {
        addNotification(notification);
      }
      toast(notification.title, {
        icon: notification.type === 'urgent_request' ? '🚨' : notification.type === 'message' ? '✉️' : '🔔',
        duration: 4000,
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <NotificationContext.Provider value={{ socket: socketRef }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

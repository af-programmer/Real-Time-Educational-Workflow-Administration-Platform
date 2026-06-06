import { useCallback } from 'react';
import useNotificationStore from '../store/notificationStore';
import { notificationsApi } from '../api/notificationsApi';
import toast from 'react-hot-toast';

export function useNotificationActions() {
  const { markAllRead } = useNotificationStore();

  const markAll = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      markAllRead();
    } catch {
      toast.error('Failed to mark notifications as read.');
    }
  }, [markAllRead]);

  return { markAll };
}

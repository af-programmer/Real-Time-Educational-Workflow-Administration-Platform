import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import toast from 'react-hot-toast';
import { notificationsApi } from '../api/notificationsApi';

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
document.addEventListener('click', () => getAudioCtx(), { once: false, passive: true });
document.addEventListener('keydown', () => getAudioCtx(), { once: false, passive: true });

function beep(ctx, freq, startTime, duration, type = 'sine', volume = 0.3) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const play = () => {
      if (type === 'urgent_request') {
        beep(ctx, 880, ctx.currentTime,        0.12, 'square', 0.4);
        beep(ctx, 880, ctx.currentTime + 0.18, 0.12, 'square', 0.4);
        beep(ctx, 880, ctx.currentTime + 0.36, 0.12, 'square', 0.4);
      } else if (type === 'print_completed') {
        beep(ctx, 523, ctx.currentTime,        0.15, 'sine', 0.25);
        beep(ctx, 659, ctx.currentTime + 0.18, 0.15, 'sine', 0.25);
        beep(ctx, 784, ctx.currentTime + 0.36, 0.3,  'sine', 0.3);
      } else {
        beep(ctx, 660, ctx.currentTime,        0.3, 'sine', 0.25);
        beep(ctx, 880, ctx.currentTime + 0.15, 0.4, 'sine', 0.25);
      }
    };
    ctx.resume().then(play);
  } catch {}
}

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, token, isAuthenticated } = useAuthStore();
  const { setNotifications, addNotification } = useNotificationStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    notificationsApi.getAll({ limit: 10, offset: 0 }).then(({ data }) => {
      const list = data?.data;
      setNotifications(Array.isArray(list) ? list : [], data?.unreadCount || 0, data?.hasMore || false);
    }).catch(() => {});

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(`${apiBase}/notifications`, {
      auth: { userId: user.id, role: user.role },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('notification', (notification) => {
      if (notification.type !== 'message') {
        addNotification(notification);
      }
      playSound(notification.type);
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

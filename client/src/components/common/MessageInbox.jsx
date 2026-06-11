import { useState, useEffect, useCallback } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { useNotifications } from '../../context/NotificationContext';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import MessageListPanel from './MessageListPanel';
import MessageDetailPanel from './MessageDetailPanel';

export default function MessageInbox({ onUnreadChange, refreshKey }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { socket } = useNotifications();

  const fetchInbox = useCallback(() =>
    messagesApi.getInbox().then((r) => setMessages(r.data.data || [])).catch(() => {}),
  []);

  useEffect(() => {
    setLoading(true);
    fetchInbox().finally(() => setLoading(false));
  }, [refreshKey, fetchInbox]);

  useEffect(() => {
    const sock = socket?.current;
    if (!sock) return;
    const handler = (n) => { if (n.type === 'message') fetchInbox(); };
    sock.on('notification', handler);
    return () => sock.off('notification', handler);
  }, [socket, fetchInbox]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await messagesApi.markRead(msg.id).catch(() => {});
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      onUnreadChange?.();
    }
  };

  const deleteMessage = async (msg) => {
    try {
      await messagesApi.delete(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
    } catch { toast.error('Failed to delete message.'); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <MessageListPanel messages={messages} selectedId={selected?.id} onSelect={openMessage} onDeleteMessage={deleteMessage} />
      <MessageDetailPanel message={selected} onDeleteMessage={deleteMessage} />
    </div>
  );
}

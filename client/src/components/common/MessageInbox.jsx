import { useState, useEffect } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { useNotifications } from '../../context/NotificationContext';
import Spinner from './Spinner';
import { format } from 'date-fns';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function MessageInbox({ onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { socket } = useNotifications();

  useEffect(() => {
    messagesApi.getInbox()
      .then((r) => setMessages(r.data.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const sock = socket?.current;
    if (!sock) return;
    const handler = (notification) => {
      if (notification.type !== 'message') return;
      messagesApi.getInbox()
        .then((r) => setMessages(r.data.data || []))
        .catch(() => {});
    };
    sock.on('notification', handler);
    return () => sock.off('notification', handler);
  }, [socket]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await messagesApi.markRead(msg.id).catch(() => { });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      onUnreadChange?.();
    }
  };

  const deleteMessage = async (e, msg) => {
    e.stopPropagation();
    try {
      await messagesApi.delete(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
    } catch {
      toast.error('Failed to delete message.');
    }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">
          Inbox ({unreadCount} unread)
        </div>
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p>No messages</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
            {messages.map((msg) => (
              <li key={msg.id} onClick={() => openMessage(msg)}
                className={clsx('px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group',
                  !msg.is_read && 'bg-blue-50', selected?.id === msg.id && 'bg-primary-50')}>
                <div className="flex justify-between gap-2 items-start">
                  <div className="min-w-0 flex-1">
                    <p className={clsx('text-sm truncate', !msg.is_read ? 'font-semibold text-gray-900' : 'text-gray-700')}>
                      {msg.sender_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.subject || msg.body}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <p className="text-xs text-gray-400">{format(new Date(msg.created_at), 'dd MMM')}</p>
                    <div className="flex items-center gap-1">
                      {!msg.is_read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      <button
                        onClick={(e) => deleteMessage(e, msg)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-xs px-1"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-5">
        {selected ? (
          <div>
            <div className="flex justify-between items-start gap-3 mb-1">
              <h3 className="font-semibold text-lg text-gray-900">{selected.subject || 'No Subject'}</h3>
              <button
                onClick={(e) => deleteMessage(e, selected)}
                className="text-gray-400 hover:text-red-500 transition-colors text-sm flex-shrink-0"
                title="Delete message"
              >
                🗑 Delete
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              From: <b>{selected.sender_name}</b> · {format(new Date(selected.created_at), 'dd MMM yyyy, HH:mm')}
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-center">
            <div><div className="text-5xl mb-3">✉️</div><p>Select a message to read</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

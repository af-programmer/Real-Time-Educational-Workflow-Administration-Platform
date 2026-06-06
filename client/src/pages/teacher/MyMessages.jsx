import { useState, useEffect } from 'react';
import { messagesApi } from '../../api/messagesApi';
import Spinner from '../../components/common/Spinner';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    messagesApi.getInbox()
      .then((r) => setMessages(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await messagesApi.markRead(msg.id).catch(() => {});
      setMessages((prev) =>
        prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m)
      );
    }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="grid lg:grid-cols-2 gap-5 h-full">
      {/* Message List */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">
          Inbox ({messages.filter((m) => !m.is_read).length} unread)
        </div>
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">✉️</div>
            <p>No messages yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <li
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={clsx(
                  'px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors',
                  !msg.is_read && 'bg-blue-50',
                  selected?.id === msg.id && 'bg-primary-50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={clsx('text-sm truncate', !msg.is_read ? 'font-semibold text-gray-900' : 'text-gray-700')}>
                      {msg.sender_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.subject || msg.body}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-400">{format(new Date(msg.created_at), 'dd MMM')}</p>
                    {!msg.is_read && <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Message Detail */}
      <div className="card p-5">
        {selected ? (
          <div>
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                {selected.subject || 'No Subject'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                From: <span className="font-medium text-gray-700">{selected.sender_name}</span>
                {' · '}
                {format(new Date(selected.created_at), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-center">
            <div>
              <div className="text-5xl mb-3">✉️</div>
              <p>Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

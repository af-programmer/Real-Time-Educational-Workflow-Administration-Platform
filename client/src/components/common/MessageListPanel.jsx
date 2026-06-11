import { format } from 'date-fns';
import clsx from 'clsx';

export default function MessageListPanel({ messages, selectedId, onSelect, onDeleteMessage }) {
  const unreadCount = messages.filter((m) => !m.is_read).length;
  return (
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
            <li key={msg.id} onClick={() => onSelect(msg)}
              className={clsx('px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group',
                !msg.is_read && 'bg-blue-50', selectedId === msg.id && 'bg-primary-50')}>
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
                      onClick={(e) => { e.stopPropagation(); onDeleteMessage(msg); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-xs px-1"
                      title="Delete"
                    >🗑</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

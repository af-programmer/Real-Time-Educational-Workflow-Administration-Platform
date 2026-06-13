import { format } from 'date-fns';

export default function MessageDetailPanel({ message, onDeleteMessage, onClose }) {
  if (!message) {
    return (
      <div className="card p-5 h-full flex items-center justify-center text-gray-400 text-center">
        <div>
          <div className="text-5xl mb-3">✉️</div>
          <p>Select a message to read</p>
        </div>
      </div>
    );
  }
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start gap-3 mb-1">
        <h3 className="font-semibold text-lg text-gray-900">{message.subject || 'No Subject'}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onDeleteMessage(message)}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm"
            title="Delete message"
          >🗑 Delete</button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
              title="Close"
            >✕</button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        From: <b>{message.sender_name}</b> · {format(new Date(message.created_at), 'dd MMM yyyy, HH:mm')}
      </p>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.body}</p>
      {message.attachment_path && (
        <a href={`/uploads/${message.attachment_path}`} target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:underline">
          📎 {message.attachment_name}
        </a>
      )}
    </div>
  );
}

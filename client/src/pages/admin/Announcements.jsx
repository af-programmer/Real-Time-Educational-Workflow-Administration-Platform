import { useState } from 'react';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const PAGE_SIZE = 7;

export default function Announcements() {
  const [sentLog, setSentLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminSentLog') || '[]'); } catch { return []; }
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSent = (entry) => {
    const newEntry = { ...entry, sentAt: new Date().toLocaleString('he-IL') };
    const updated = [newEntry, ...sentLog].slice(0, 50);
    setSentLog(updated);
    setVisibleCount(PAGE_SIZE);
    localStorage.setItem('adminSentLog', JSON.stringify(updated));
  };

  const visible = sentLog.slice(0, visibleCount);
  const hasMore = visibleCount < sentLog.length;

  return (
    <div className="max-w-2xl space-y-6">
      <AnnouncementForm onSent={handleSent} />
      {sentLog.length > 0 && (
        <div className="card p-5">
          <p className="label mb-3">📋 Sent Notifications</p>
          <ul className="space-y-2">
            {visible.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                <div>
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="ml-2 text-xs text-gray-400">→ {item.target}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">🔔</span>
                </div>
                <span className="text-xs text-gray-400">{item.sentAt}</span>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-3 w-full text-sm text-primary-600 hover:text-primary-800 font-medium py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Load More ({sentLog.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

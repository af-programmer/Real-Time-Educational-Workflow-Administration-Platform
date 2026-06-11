import { useState } from 'react';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

export default function Announcements() {
  const [sentLog, setSentLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminSentLog') || '[]'); } catch { return []; }
  });

  const handleSent = (entry) => {
    const newEntry = { ...entry, sentAt: new Date().toLocaleString('he-IL') };
    const updated = [newEntry, ...sentLog].slice(0, 50);
    setSentLog(updated);
    localStorage.setItem('adminSentLog', JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <AnnouncementForm onSent={handleSent} />
      {sentLog.length > 0 && (
        <div className="card p-5">
          <p className="label mb-3">📋 Sent This Session</p>
          <ul className="space-y-2">
            {sentLog.map((item, i) => (
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
        </div>
      )}
    </div>
  );
}

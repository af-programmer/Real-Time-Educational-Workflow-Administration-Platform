import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notificationsApi } from '../../api/notificationsApi';
import { messagesApi } from '../../api/messagesApi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function Announcements() {
  const [type, setType] = useState('notification');
  const [sending, setSending] = useState(false);
  const [sentLog, setSentLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminSentLog') || '[]'); } catch { return []; }
  });
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      if (type === 'notification') {
        await notificationsApi.createAnnouncement({
          title: data.title,
          content: data.message,
          targetRole: data.target,
        });
      } else {
        await messagesApi.broadcast({
          recipient_role: data.target,
          subject: data.title,
          body: data.message,
        });
      }
      const entry = {
        type,
        title: data.title,
        target: data.target,
        sentAt: new Date().toLocaleString('he-IL'),
      };
      const updated = [entry, ...sentLog].slice(0, 50);
      setSentLog(updated);
      localStorage.setItem('adminSentLog', JSON.stringify(updated));
      toast.success('Announcement sent!');
      reset();
    } catch {
      toast.error('Failed to send announcement.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Type Selector */}
      <div className="card p-5">
        <p className="label mb-3">Announcement Type</p>
        <div className="grid grid-cols-2 gap-3">
          {['notification', 'message'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                type === t ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">
                {t === 'notification' ? '🔔 System Notification' : '📨 Broadcast Message'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t === 'notification'
                  ? 'Appears in notification center'
                  : 'Sent to inbox of recipients'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Send To *</label>
            <select {...register('target', { required: true })} className="input">
              <option value="all">All Staff</option>
              <option value="all_teachers">All Teachers</option>
              <option value="all_secretaries">All Secretaries</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>

          <div>
            <label className="label">Title *</label>
            <input
              {...register('title', { required: true })}
              type="text"
              className="input"
              placeholder="Announcement title..."
            />
          </div>

          <div>
            <label className="label">Message *</label>
            <textarea
              {...register('message', { required: true })}
              rows={6}
              className="input resize-none"
              placeholder="Write your announcement..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={sending} className="flex-1">
              📢 Send Announcement
            </Button>
            <Button type="button" variant="secondary" onClick={reset}>
              Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Sent Log */}
      {sentLog.length > 0 && (
        <div className="card p-5">
          <p className="label mb-3">📋 Sent This Session</p>
          <ul className="space-y-2">
            {sentLog.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                <div>
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="ml-2 text-xs text-gray-400">→ {item.target}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {item.type === 'notification' ? '🔔' : '📨'}
                  </span>
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

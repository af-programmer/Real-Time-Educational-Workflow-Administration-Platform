import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notificationsApi } from '../../api/notificationsApi';
import { messagesApi } from '../../api/messagesApi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function Announcements() {
  const [type, setType] = useState('notification');
  const [sending, setSending] = useState(false);
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
    </div>
  );
}

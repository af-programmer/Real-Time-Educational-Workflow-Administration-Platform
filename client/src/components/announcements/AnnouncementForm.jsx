import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notificationsApi } from '../../api/notificationsApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function AnnouncementForm({ onSent }) {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await notificationsApi.createAnnouncement({ title: data.title, content: data.message, targetRole: data.target });
      toast.success('Announcement sent!');
      reset();
      onSent?.({ title: data.title, target: data.target });
    } catch { toast.error('Failed to send announcement.'); }
    finally { setSending(false); }
  };

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">🔔 System Notification</h2>
      <p className="text-sm text-gray-600 mb-4">Send system notifications that appear in users' notification center</p>
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
          <input {...register('title', { required: true })} type="text" className="input" placeholder="Notification title..." />
        </div>
        <div>
          <label className="label">Message *</label>
          <textarea {...register('message', { required: true })} rows={6} className="input resize-none" placeholder="Write your notification..." />
        </div>
        <div className="flex gap-3">
          <Button type="submit" loading={sending} className="flex-1">📢 Send Notification</Button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import { messagesApi } from '../../api/messagesApi';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import StaffProfileCard from '../../components/profile/StaffProfileCard';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function StaffProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    usersApi.getProfile(id).then((r) => setProfile(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const sendMessage = async (data) => {
    setSending(true);
    try {
      await messagesApi.send({ recipient_id: parseInt(id), subject: data.subject, body: data.body });
      toast.success('Message sent!');
      setShowMessageModal(false);
      reset();
    } catch { toast.error('Failed to send message.'); }
    finally { setSending(false); }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!profile) return (
    <div className="text-center py-20 text-gray-400">
      <p>Staff member not found.</p>
      <Link to="/admin/staff" className="text-primary-600 mt-2 block">← Back to staff</Link>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link to="/admin/staff" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
        <Button onClick={() => setShowMessageModal(true)}>✉️ Send Message</Button>
      </div>
      <StaffProfileCard profile={profile} />
      <Modal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} title={`Send Message to ${profile.name}`}>
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-4">
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} type="text" className="input" placeholder="Message subject..." />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea {...register('body', { required: true })} rows={5} className="input resize-none" placeholder="Write your message..." />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setShowMessageModal(false)}>Cancel</Button>
            <Button type="submit" loading={sending}>Send Message</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

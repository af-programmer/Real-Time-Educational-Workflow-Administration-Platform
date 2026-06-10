import { useState, useEffect } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { teachersApi } from '../../api/usersApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function MyMessages() {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const requests = [
      teachersApi.getSecretaries().then((r) => (r.data.data || []).map((u) => ({ ...u, _group: 'Secretary' }))),
    ];
    if (user?.is_homeroom) {
      requests.push(
        teachersApi.getMyHomeroomTeachers().then((r) => (r.data.data || []).map((u) => ({ ...u, _group: 'Teacher (my class)' })))
      );
    }
    Promise.all(requests)
      .then((groups) => setRecipients(groups.flat()))
      .catch(() => {});
  }, [user?.is_homeroom]);

  const sendMessage = async (data) => {
    setSending(true);
    try {
      await messagesApi.send({ recipient_id: parseInt(data.recipient_id), subject: data.subject, body: data.body }, attachment);
      toast.success('Message sent!');
      setShowModal(false);
      reset();
      setAttachment(null);
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)}>✉️ New Message</Button>
      </div>

      <MessageInbox />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setAttachment(null); }} title="New Message">
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-4">
          <div>
            <label className="label">Send To *</label>
            <select {...register('recipient_id', { required: true })} className="input">
              <option value="">Select recipient...</option>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>{r.name}{r._group ? ` — ${r._group}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} type="text" className="input" placeholder="Optional subject..." />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea {...register('body', { required: true })} rows={5} className="input resize-none" />
          </div>
          <div>
            <label className="label">Attachment</label>
            <input type="file" className="input" onChange={(e) => setAttachment(e.target.files[0] || null)} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => { setShowModal(false); reset(); }}>Cancel</Button>
            <Button type="submit" loading={sending}>Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

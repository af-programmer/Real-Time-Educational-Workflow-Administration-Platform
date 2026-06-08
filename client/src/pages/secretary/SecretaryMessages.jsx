import { useState } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { teachersApi } from '../../api/usersApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function SecretaryMessages() {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    teachersApi.getAll({ limit: 100 }).then((r) => setTeachers(r.data.data || [])).catch(() => {});
  }, []);

  const sendMessage = async (data) => {
    setSending(true);
    try {
      await messagesApi.send({
        recipient_id: parseInt(data.recipient_id),
        subject: data.subject,
        body: data.body,
      });
      toast.success('Message sent!');
      setShowModal(false);
      reset();
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="New Message">
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-4">
          <div>
            <label className="label">Send To *</label>
            <select {...register('recipient_id', { required: true })} className="input">
              <option value="">Select teacher...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
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
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => { setShowModal(false); reset(); }}>Cancel</Button>
            <Button type="submit" loading={sending}>Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

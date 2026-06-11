import { useState, useEffect } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { usersApi } from '../../api/usersApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    usersApi.getAll({ limit: 100 }).then((r) => setUsers((r.data.data || []).filter((u) => u.role !== 'admin'))).catch(() => {});
  }, []);

  const send = async (data) => {
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
      <div className="flex gap-3 justify-end">
        <Button onClick={() => { reset({}); setShowModal(true); }}>✉️ New Message</Button>
      </div>

      <MessageInbox />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setAttachment(null); }}
        title="New Message">
        <form onSubmit={handleSubmit(send)} className="space-y-4">
          <div>
            <label className="label">Recipient *</label>
            <select {...register('recipient_id', { required: true })} className="input">
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} type="text" className="input" placeholder="Optional..." />
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

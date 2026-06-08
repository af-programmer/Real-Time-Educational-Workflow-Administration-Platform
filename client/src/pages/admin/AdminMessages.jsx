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
  const [broadcastMode, setBroadcastMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    usersApi.getAll({ limit: 100 }).then((r) => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const send = async (data) => {
    setSending(true);
    try {
      if (broadcastMode) {
        await messagesApi.broadcast({ recipient_role: data.recipient_role, subject: data.subject, body: data.body });
      } else {
        await messagesApi.send({ recipient_id: parseInt(data.recipient_id), subject: data.subject, body: data.body });
      }
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
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={() => { setBroadcastMode(true); reset({ recipient_role: 'all' }); setShowModal(true); }}>
          📢 Broadcast
        </Button>
        <Button onClick={() => { setBroadcastMode(false); reset({}); setShowModal(true); }}>✉️ New Message</Button>
      </div>

      <MessageInbox />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }}
        title={broadcastMode ? 'Broadcast Message' : 'New Message'}>
        <form onSubmit={handleSubmit(send)} className="space-y-4">
          {broadcastMode ? (
            <div>
              <label className="label">Send To *</label>
              <select {...register('recipient_role', { required: true })} defaultValue="all" className="input">
                <option value="all">All Staff</option>
                <option value="all_teachers">All Teachers</option>
                <option value="all_secretaries">All Secretaries</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="label">Recipient *</label>
              <select {...register('recipient_id', { required: true })} className="input">
                <option value="">Select user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} type="text" className="input" placeholder="Optional..." />
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

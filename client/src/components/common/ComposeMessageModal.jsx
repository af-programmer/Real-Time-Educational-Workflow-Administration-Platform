import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { messagesApi } from '../../api/messagesApi';
import Modal from './Modal';
import Button from './Button';
import toast from 'react-hot-toast';

export default function ComposeMessageModal({ isOpen, onClose, recipients, getOptionLabel, onSent }) {
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const defaultLabel = (r) => `${r.name}${r.role ? ` (${r.role})` : ''}`;
  const labelFn = getOptionLabel || defaultLabel;

  const close = () => { onClose(); reset(); setAttachment(null); };

  const send = async (data) => {
    setSending(true);
    try {
      await messagesApi.send(
        { recipient_id: parseInt(data.recipient_id), subject: data.subject, body: data.body },
        attachment
      );
      toast.success('Message sent!');
      close();
      onSent?.();
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="New Message">
      <form onSubmit={handleSubmit(send)} className="space-y-4">
        <div>
          <label className="label">Send To *</label>
          <select {...register('recipient_id', { required: true })} className="input">
            <option value="">Select recipient...</option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>{labelFn(r)}</option>
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
          <Button variant="secondary" type="button" onClick={close}>Cancel</Button>
          <Button type="submit" loading={sending}>Send</Button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { messagesApi } from '../../api/messagesApi';
import Modal from './Modal';
import Button from './Button';
import toast from 'react-hot-toast';

export default function ComposeMessageModal({ isOpen, onClose, recipients, getOptionLabel, onSent }) {
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const defaultLabel = (r) => `${r.name}${r.role ? ` (${r.role})` : ''}`;
  const labelFn = getOptionLabel || defaultLabel;

  const close = () => { onClose(); reset(); setAttachment(null); setSelectedIds([]); };

  function toggleRecipient(id) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  const send = async (data) => {
    if (!selectedIds.length) { toast.error('Please select at least one recipient.'); return; }
    setSending(true);
    try {
      await messagesApi.send({ recipient_ids: selectedIds, subject: data.subject, body: data.body }, attachment);
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
          <label className="label">
            Send To *
            {selectedIds.length > 0 && (
              <span className="ml-2 text-xs text-gray-400">({selectedIds.length} selected)</span>
            )}
          </label>
          <div className="border border-gray-300 rounded-lg max-h-36 overflow-y-auto divide-y divide-gray-100">
            {recipients.map((r) => (
              <label key={r.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => toggleRecipient(r.id)}
                  className="rounded"
                />
                <span className="text-sm">{labelFn(r)}</span>
              </label>
            ))}
          </div>
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

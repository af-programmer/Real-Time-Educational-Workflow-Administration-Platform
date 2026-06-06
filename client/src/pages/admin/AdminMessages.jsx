import { useState, useEffect } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { usersApi } from '../../api/usersApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    Promise.all([
      messagesApi.getInbox(),
      usersApi.getAll({ limit: 100 }),
    ]).then(([msgRes, usersRes]) => {
      setMessages(msgRes.data.data || []);
      setUsers(usersRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
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
      messagesApi.getInbox().then((r) => setMessages(r.data.data || []));
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await messagesApi.markRead(msg.id).catch(() => {});
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={() => { setBroadcastMode(true); setShowModal(true); }}>
          📢 Broadcast
        </Button>
        <Button onClick={() => { setBroadcastMode(false); setShowModal(true); }}>✉️ New Message</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">
            Inbox ({messages.filter((m) => !m.is_read).length} unread)
          </div>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><div className="text-3xl mb-2">📭</div><p>Empty inbox</p></div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {messages.map((msg) => (
                <li key={msg.id} onClick={() => openMessage(msg)}
                  className={clsx('px-4 py-3 cursor-pointer hover:bg-gray-50',
                    !msg.is_read && 'bg-blue-50', selected?.id === msg.id && 'bg-primary-50')}>
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className={clsx('text-sm truncate', !msg.is_read ? 'font-semibold' : 'text-gray-700')}>
                        {msg.sender_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{msg.subject || msg.body}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{format(new Date(msg.created_at), 'dd MMM')}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          {selected ? (
            <div>
              <h3 className="font-semibold text-lg">{selected.subject || 'No Subject'}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                From: <b>{selected.sender_name}</b> · {format(new Date(selected.created_at), 'dd MMM yyyy, HH:mm')}
              </p>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.body}</p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              <div><div className="text-5xl mb-3">✉️</div><p>Select a message</p></div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }}
        title={broadcastMode ? 'Broadcast Message' : 'New Message'}>
        <form onSubmit={handleSubmit(send)} className="space-y-4">
          {broadcastMode ? (
            <div>
              <label className="label">Send To *</label>
              <select {...register('recipient_role', { required: true })} className="input">
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

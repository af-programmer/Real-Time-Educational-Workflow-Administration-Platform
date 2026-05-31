import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teachersApi } from '../../api/usersApi';
import { printRequestsApi } from '../../api/printRequestsApi';
import { messagesApi } from '../../api/messagesApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TeacherProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    Promise.all([
      teachersApi.getProfile(id),
      printRequestsApi.getAll({ teacherId: id, limit: 20 }),
    ]).then(([profileRes, reqRes]) => {
      setProfile(profileRes.data.data);
      setRequests(reqRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const sendMessage = async (data) => {
    setSending(true);
    try {
      await messagesApi.send({ recipient_id: parseInt(id), subject: data.subject, body: data.body });
      toast.success('Message sent!');
      setShowMessageModal(false);
      reset();
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (!profile) return (
    <div className="text-center py-20 text-gray-400">
      <p>Teacher not found.</p>
      <Link to="/secretary/teachers" className="text-primary-600 mt-2 block">← Back to teachers</Link>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link to="/secretary/teachers" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Back
        </Link>
        <Button onClick={() => setShowMessageModal(true)}>✉️ Send Message</Button>
      </div>

      {/* Profile Card */}
      <div className="card p-6 flex flex-col sm:flex-row gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-3xl font-bold flex-shrink-0">
          {profile.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
              {profile.phone && <p className="text-gray-500 text-sm">{profile.phone}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Badge label={profile.role} variant={profile.role} />
              {profile.is_blocked && <Badge label="Blocked" variant="urgent" />}
              {!profile.is_active && <Badge label="Inactive" variant="pending" />}
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Classes</p>
              <div className="flex flex-wrap gap-1">
                {profile.classes?.map((c) => (
                  <span key={c.id} className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    {c.name} ({c.student_count})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {profile.subjects?.map((s) => (
                  <span key={s.id} className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Request History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Print Request History ({requests.length})
        </div>
        {requests.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No print requests yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{req.subject_name}</p>
                  <p className="text-xs text-gray-500">
                    {req.lesson_date ? format(new Date(req.lesson_date), 'dd MMM yyyy') : ''} · {req.total_copies} copies
                  </p>
                  {req.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 italic line-clamp-1">{req.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge label={req.priority} variant={req.priority} />
                  <Badge label={req.status} variant={req.status} />
                  <a
                    href={printRequestsApi.getCoverUrl(req.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Cover PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Message Modal */}
      <Modal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} title="Send Message to Teacher">
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-4">
          <div>
            <label className="label">Subject</label>
            <input {...register('subject')} type="text" className="input" placeholder="Message subject..." />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea {...register('body', { required: true })} rows={5} className="input resize-none"
              placeholder="Write your message..." />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setShowMessageModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={sending}>Send Message</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

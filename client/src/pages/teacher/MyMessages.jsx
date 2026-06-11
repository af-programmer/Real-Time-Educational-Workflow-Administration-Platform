import { useState, useEffect } from 'react';
import { teachersApi } from '../../api/usersApi';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import ComposeMessageModal from '../../components/common/ComposeMessageModal';
import useAuthStore from '../../store/authStore';

export default function MyMessages() {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [inboxKey, setInboxKey] = useState(0);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)}>✉️ New Message</Button>
      </div>

      <MessageInbox refreshKey={inboxKey} />

      <ComposeMessageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipients={recipients}
        getOptionLabel={(r) => `${r.name}${r._group ? ` — ${r._group}` : ''}`}
        onSent={() => setInboxKey((k) => k + 1)}
      />
    </div>
  );
}

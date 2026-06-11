import { useState, useEffect } from 'react';
import { teachersApi } from '../../api/usersApi';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import ComposeMessageModal from '../../components/common/ComposeMessageModal';

export default function SecretaryMessages() {
  const [showModal, setShowModal] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [inboxKey, setInboxKey] = useState(0);

  useEffect(() => {
    Promise.all([
      teachersApi.getAll({ limit: 100 }),
      teachersApi.getAdmins(),
    ]).then(([teachersRes, adminsRes]) => {
      setRecipients([
        ...(teachersRes.data.data || []),
        ...(adminsRes.data.data || []),
      ]);
    }).catch(() => {});
  }, []);

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
        onSent={() => setInboxKey((k) => k + 1)}
      />
    </div>
  );
}

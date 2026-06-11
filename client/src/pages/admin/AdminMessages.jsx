import { useState, useEffect } from 'react';
import { usersApi } from '../../api/usersApi';
import Button from '../../components/common/Button';
import MessageInbox from '../../components/common/MessageInbox';
import ComposeMessageModal from '../../components/common/ComposeMessageModal';

export default function AdminMessages() {
  const [showModal, setShowModal] = useState(false);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    usersApi.getAll({ limit: 100 })
      .then((r) => setRecipients((r.data.data || []).filter((u) => u.role !== 'admin')))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 justify-end">
        <Button onClick={() => setShowModal(true)}>✉️ New Message</Button>
      </div>

      <MessageInbox />

      <ComposeMessageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipients={recipients}
      />
    </div>
  );
}

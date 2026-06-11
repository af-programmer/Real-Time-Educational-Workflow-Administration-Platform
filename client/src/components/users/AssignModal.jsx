import { useState, useEffect } from 'react';
import { usersApi } from '../../api/usersApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function AssignModal({ user, classes, subjects, onClose }) {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedHomeroomClasses, setSelectedHomeroomClasses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setSelectedHomeroomClasses([]);
    usersApi.getProfile(user.id).then((r) => {
      const profile = r.data.data;
      setSelectedClasses((profile.classes || []).map((c) => c.id));
      setSelectedSubjects((profile.subjects || []).map((s) => s.id));
      setSelectedHomeroomClasses((profile.homeroomClasses || []).map((c) => c.id));
    }).catch(() => {});
  }, [user?.id]);

  const saveAssign = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (selectedClasses.length) await usersApi.assignClasses(user.id, selectedClasses);
      if (selectedSubjects.length) await usersApi.assignSubjects(user.id, selectedSubjects);
      await usersApi.assignHomeroomClasses(user.id, selectedHomeroomClasses);
      toast.success('Assignments saved!');
      onClose();
    } catch {
      toast.error('Failed to save assignments.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = (setter, id) => setter((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );

  return (
    <Modal isOpen={!!user} onClose={onClose} title={`Assign to ${user?.name}`} size="lg">
      <div className="space-y-5">
        <div>
          <p className="label mb-2">Classes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {classes.map((c) => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedClasses.includes(c.id)} onChange={() => toggle(setSelectedClasses, c.id)} className="rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">{c.name} ({c.student_count})</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-2">Subjects</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjects.map((s) => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedSubjects.includes(s.id)} onChange={() => toggle(setSelectedSubjects, s.id)} className="rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">{s.name}</span>
              </label>
            ))}
          </div>
        </div>
        {user?.role === 'teacher' && (
          <div>
            <p className="label mb-2">Homeroom Classes (כיתות חינוך)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classes.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selectedHomeroomClasses.includes(c.id)} onChange={() => toggle(setSelectedHomeroomClasses, c.id)} className="rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-700">{c.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={saveAssign} loading={submitting}>Save Assignments</Button>
        </div>
      </div>
    </Modal>
  );
}

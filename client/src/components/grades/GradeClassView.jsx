import { useState } from 'react';
import GradeFolderCard from './GradeFolderCard';
import GradeEntry from './GradeEntry';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';

export default function GradeClassView({ classes, classSubjects, activeClassId, gradesLoading, onSelectClass, onSelectSubject, subjects, onGradeEntered }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {classes.map((c) => (
            <button key={c.id} onClick={() => onSelectClass(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeClassId === c.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>ENTER/EDIT GRADES</Button>
      </div>

      {gradesLoading ? (
        <Spinner className="py-10" />
      ) : Object.keys(classSubjects).length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(classSubjects).map(([subName, examTypes]) => {
            const total = Object.values(examTypes).reduce((a, arr) => a + arr.length, 0);
            return (
              <GradeFolderCard key={subName} icon="📁" label={subName}
                count={`${total} grade${total !== 1 ? 's' : ''}`}
                onClick={() => onSelectSubject(subName)} />
            );
          })}
        </div>
      ) : (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-sm">No grades entered for this class yet.</p>
          <p className="text-xs mt-1">Click "+ Enter Grade" to add the first one.</p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Grades" size="xl">
        <GradeEntry classes={classes} subjects={subjects} initialClassId={activeClassId}
          onSuccess={() => { setShowModal(false); onGradeEntered(); }} />
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import GradeBreadcrumb from './GradeBreadcrumb';
import GradeFolderCard from './GradeFolderCard';
import GradeEntry from './GradeEntry';
import Button from '../common/Button';
import Modal from '../common/Modal';

const EXAM_LABEL = {
  test: 'Test', quiz: 'Quiz', midterm: 'Midterm Exam',
  final: 'Final Exam', homework: 'Homework', exam: 'Final Exam', project: 'Project',
};

export default function GradeSubjectView({ subjectExamTypes, subjectName, className, onBackToClass, onSelectExamType, classes, subjects, activeClassId, onGradeEntered }) {
  const [showModal, setShowModal] = useState(false);
  const examTypes = Object.keys(subjectExamTypes);

  return (
    <div className="space-y-4">
      <GradeBreadcrumb parts={[
        { label: className, onClick: onBackToClass },
        { label: subjectName },
      ]} />
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{subjectName} — Exam Types</h3>
        <Button size="sm" onClick={() => setShowModal(true)}>+ Enter Grade</Button>
      </div>
      {examTypes.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {examTypes.map((et) => {
            const count = subjectExamTypes[et].length;
            return (
              <GradeFolderCard key={et} icon="📄" label={EXAM_LABEL[et] || et}
                count={`${count} grade${count !== 1 ? 's' : ''}`}
                onClick={() => onSelectExamType(et)} />
            );
          })}
        </div>
      ) : (
        <div className="card p-8 text-center text-gray-400">
          <p className="text-3xl mb-2">📄</p>
          <p className="text-sm">No grades entered for this subject yet.</p>
          <Button size="sm" className="mt-3" onClick={() => setShowModal(true)}>+ Enter First Grade</Button>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Grades" size="xl">
        <GradeEntry classes={classes} subjects={subjects} initialClassId={activeClassId}
          initialSubjectId={subjects.find((s) => s.name === subjectName)?.id}
          onSuccess={() => { setShowModal(false); onGradeEntered(); }} />
      </Modal>
    </div>
  );
}

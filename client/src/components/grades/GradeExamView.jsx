import { useState } from 'react';
import GradeBreadcrumb from './GradeBreadcrumb';
import GradeEntry from './GradeEntry';
import Button from '../common/Button';
import Modal from '../common/Modal';

const EXAM_LABEL = {
  test: 'Test', quiz: 'Quiz', midterm: 'Midterm Exam',
  final: 'Final Exam', homework: 'Homework', exam: 'Final Exam', project: 'Project',
};

function avg(grades) {
  if (!grades.length) return null;
  const sum = grades.reduce((a, g) => a + (g.grade / g.max_grade) * 100, 0);
  return (sum / grades.length).toFixed(1);
}

export default function GradeExamView({ grades, examType, subjectName, className, onBackToClass, onBackToSubject, classes, subjects, activeClassId, onGradeEntered }) {
  const [showModal, setShowModal] = useState(false);
  const average = avg(grades);

  return (
    <div className="space-y-4">
      <GradeBreadcrumb parts={[
        { label: className, onClick: onBackToClass },
        { label: subjectName, onClick: onBackToSubject },
        { label: EXAM_LABEL[examType] || examType },
      ]} />
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{EXAM_LABEL[examType] || examType} — {subjectName}</h3>
          <Button size="sm" onClick={() => setShowModal(true)}>+ Enter Grade</Button>
        </div>
        {grades.length ? (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Student', 'Grade', 'Date', 'Notes'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {grades.map((g) => {
                  const pct = (g.grade / g.max_grade) * 100;
                  const color = pct >= 85 ? 'text-green-600' : pct >= 70 ? 'text-blue-600' : pct >= 55 ? 'text-yellow-600' : 'text-red-600';
                  return (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{g.student_name}</td>
                      <td className={`px-4 py-3 font-bold ${color}`}>{g.grade} / {g.max_grade}</td>
                      <td className="px-4 py-3 text-gray-500">{g.date ? new Date(g.date).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{g.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {average !== null && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  className="text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors"
                  onClick={() => alert(`Average for ${examType}: ${average}%`)}
                >
                  📊 Calculate Average: {average}%
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-sm p-6 text-center">No grades entered yet.</p>
        )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Grades" size="xl">
        <GradeEntry classes={classes} subjects={subjects} initialClassId={activeClassId}
          initialSubjectId={subjects.find((s) => s.name === subjectName)?.id}
          onSuccess={() => { setShowModal(false); onGradeEntered(); }} />
      </Modal>
    </div>
  );
}

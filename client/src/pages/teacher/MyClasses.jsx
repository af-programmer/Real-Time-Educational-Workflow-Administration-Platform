import { useState, useEffect } from 'react';
import { useMyClasses } from '../../hooks/useGrades';
import { gradesApi } from '../../api/gradesApi';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const EXAM_LABEL = {
  test: 'Test', quiz: 'Quiz', midterm: 'Midterm',
  final: 'Final Exam', homework: 'Homework',
};

function gradeDisplay(g) {
  if (g.exam_type === 'homework') return g.grade >= 1 ? '✓' : '✗';
  if (g.exam_type === 'quiz') return `${g.grade}/${g.max_grade}`;
  return `${g.grade}/${g.max_grade}`;
}

function gradeColor(g) {
  if (g.exam_type === 'homework') return g.grade >= 1 ? 'text-green-600 font-bold' : 'text-red-500 font-bold';
  const pct = (g.grade / g.max_grade) * 100;
  if (pct >= 85) return 'text-green-600 font-bold';
  if (pct >= 70) return 'text-blue-600 font-semibold';
  if (pct >= 55) return 'text-yellow-600';
  return 'text-red-500 font-semibold';
}

function StudentGradeSheet({ student, onClose }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null); // gradeId
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    gradesApi.getStudentGrades(student.id)
      .then((r) => setGrades(r.data.data || []))
      .catch(() => toast.error('Failed to load grades.'))
      .finally(() => setLoading(false));
  }, [student.id]);

  // Group by subject
  const bySubject = grades.reduce((acc, g) => {
    if (!acc[g.subject_name]) acc[g.subject_name] = [];
    acc[g.subject_name].push(g);
    return acc;
  }, {});

  async function saveNote(gradeId) {
    setSavingNote(true);
    try {
      await gradesApi.update(gradeId, { notes: noteText });
      setGrades((prev) => prev.map((g) => g.id === gradeId ? { ...g, notes: noteText } : g));
      toast.success('Note saved.');
      setEditingNote(null);
    } catch {
      toast.error('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
          {student.name[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{student.name}</p>
          <p className="text-xs text-gray-500">{student.student_number || 'No student number'}</p>
        </div>
      </div>

      {loading ? (
        <Spinner className="py-10" />
      ) : grades.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">📊</p>
          <p className="text-sm">No grades recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(bySubject).map(([subject, subGrades]) => (
            <div key={subject} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 text-sm">📚 {subject}</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-2 text-xs text-gray-500 uppercase">Type</th>
                    <th className="text-center px-4 py-2 text-xs text-gray-500 uppercase">Grade</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-500 uppercase">Notes</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">
                        <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                          {EXAM_LABEL[g.exam_type] || g.exam_type}
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-center text-base ${gradeColor(g)}`}>
                        {gradeDisplay(g)}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {g.date ? new Date(g.date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs max-w-[150px]">
                        {editingNote === g.id ? (
                          <input
                            autoFocus
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full border border-primary-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
                            onKeyDown={(e) => { if (e.key === 'Enter') saveNote(g.id); if (e.key === 'Escape') setEditingNote(null); }}
                          />
                        ) : (
                          <span className={g.notes ? 'text-gray-700' : 'text-gray-300'}>
                            {g.notes || '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {editingNote === g.id ? (
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => saveNote(g.id)}
                              disabled={savingNote}
                              className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNote(null)}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingNote(g.id); setNoteText(g.notes || ''); }}
                            className="text-xs text-primary-600 hover:underline whitespace-nowrap"
                          >
                            ✏️ Note
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyClasses() {
  const { data: classes, loading } = useMyClasses();
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (loading) return <Spinner className="py-20" />;

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  return (
    <div className="space-y-5">
      {/* Class tabs */}
      <div className="flex gap-2 flex-wrap">
        {classes.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              (activeClass?.id === c.id)
                ? 'bg-primary-600 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {activeClass ? (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Class {activeClass.name} — {activeClass.students?.length || 0} students
            </h2>
            {activeClass.grade_level && (
              <p className="text-xs text-gray-500 mt-0.5">{activeClass.grade_level}</p>
            )}
          </div>
          {activeClass.students?.length ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone (Father)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone (Mother)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeClass.students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{s.student_number || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone_father || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone_mother || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="text-xs bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        📊 Grade Sheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm p-6 text-center">No students in this class yet.</p>
          )}
        </div>
      ) : (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">🏫</p>
          <p>No classes assigned yet.</p>
        </div>
      )}

      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Grade Sheet — ${selectedStudent?.name || ''}`}
        size="lg"
      >
        {selectedStudent && (
          <StudentGradeSheet
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </Modal>
    </div>
  );
}

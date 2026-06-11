import { useState, useMemo } from 'react';
import { useMyClasses } from '../../hooks/useGrades';
import { gradesApi } from '../../api/gradesApi';
import { useEffect } from 'react';
import GradeEntry from '../../components/grades/GradeEntry';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const EXAM_LABEL = {
  test: 'Test', quiz: 'Quiz', midterm: 'Midterm Exam',
  final: 'Final Exam', homework: 'Homework', exam: 'Final Exam', project: 'Project',
};

function avg(grades) {
  if (!grades.length) return null;
  const sum = grades.reduce((a, g) => a + (g.grade / g.max_grade) * 100, 0);
  return (sum / grades.length).toFixed(1);
}

export default function MyGrades() {
  const { data: classes, loading: classesLoading } = useMyClasses();
  const [subjects, setSubjects] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Navigation state
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);

  useEffect(() => {
    gradesApi.getMySubjects().then((r) => setSubjects(r.data.data || [])).catch(() => {});
  }, []);

  const loadGrades = () => {
    setGradesLoading(true);
    gradesApi.getMyGrades({})
      .then((r) => setAllGrades(r.data.data || []))
      .catch(() => {})
      .finally(() => setGradesLoading(false));
  };

  useEffect(() => { loadGrades(); }, []);

  // Group: classId → subjectName → examType → grades[]
  const tree = useMemo(() => {
    const map = {};
    allGrades.forEach((g) => {
      const cid = g.class_id;
      const sub = g.subject_name;
      const et = g.exam_type;
      if (!map[cid]) map[cid] = {};
      if (!map[cid][sub]) map[cid][sub] = {};
      if (!map[cid][sub][et]) map[cid][sub][et] = [];
      map[cid][sub][et].push(g);
    });
    return map;
  }, [allGrades]);

  if (classesLoading) return <Spinner className="py-20" />;

  const activeClassId = selectedClassId ?? classes[0]?.id;
  const classSubjects = tree[activeClassId] || {};

  // Breadcrumb back buttons
  const goToClass = () => { setSelectedSubjectName(null); setSelectedExamType(null); };
  const goToSubject = () => setSelectedExamType(null);

  // Render exam grades table
  if (selectedExamType && selectedSubjectName) {
    const grades = classSubjects[selectedSubjectName]?.[selectedExamType] || [];
    const average = avg(grades);
    return (
      <div className="space-y-4">
        <Breadcrumb
          parts={[
            { label: classes.find((c) => c.id === activeClassId)?.name, onClick: goToClass },
            { label: selectedSubjectName, onClick: goToSubject },
            { label: EXAM_LABEL[selectedExamType] || selectedExamType },
          ]}
        />
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {EXAM_LABEL[selectedExamType] || selectedExamType} — {selectedSubjectName}
            </h3>
            <Button size="sm" onClick={() => setShowModal(true)}>+ Enter Grade</Button>
          </div>
          {grades.length ? (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
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
                    onClick={() => alert(`Average for ${selectedExamType}: ${average}%`)}
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
          <GradeEntry
            classes={classes}
            subjects={subjects}
            initialClassId={activeClassId}
            initialSubjectId={selectedSubjectName ? subjects.find((s) => s.name === selectedSubjectName)?.id : undefined}
            onSuccess={() => { setShowModal(false); loadGrades(); }}
          />
        </Modal>
      </div>
    );
  }

  // Render subject → exam type folders
  if (selectedSubjectName) {
    const examTypes = Object.keys(classSubjects[selectedSubjectName] || {});
    return (
      <div className="space-y-4">
        <Breadcrumb
          parts={[
            { label: classes.find((c) => c.id === activeClassId)?.name, onClick: goToClass },
            { label: selectedSubjectName },
          ]}
        />
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">{selectedSubjectName} — Exam Types</h3>
          <Button size="sm" onClick={() => setShowModal(true)}>+ Enter Grade</Button>
        </div>
        {examTypes.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {examTypes.map((et) => {
              const count = classSubjects[selectedSubjectName][et].length;
              return (
                <FolderCard
                  key={et}
                  icon="📄"
                  label={EXAM_LABEL[et] || et}
                  count={`${count} grade${count !== 1 ? 's' : ''}`}
                  onClick={() => setSelectedExamType(et)}
                />
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
          <GradeEntry
            classes={classes}
            subjects={subjects}
            initialClassId={activeClassId}
            initialSubjectId={subjects.find((s) => s.name === selectedSubjectName)?.id}
            onSuccess={() => { setShowModal(false); loadGrades(); }}
          />
        </Modal>
      </div>
    );
  }

  // Render class tabs + subject folders
  return (
    <div className="space-y-5">
      {/* Class tabs */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedClassId(c.id); setSelectedSubjectName(null); setSelectedExamType(null); }}
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
        <Button size="sm" onClick={() => setShowModal(true)}>+ Enter Grade</Button>
      </div>

      {/* Subject folders */}
      {gradesLoading ? (
        <Spinner className="py-10" />
      ) : Object.keys(classSubjects).length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(classSubjects).map(([subName, examTypes]) => {
            const total = Object.values(examTypes).reduce((a, arr) => a + arr.length, 0);
            return (
              <FolderCard
                key={subName}
                icon="📁"
                label={subName}
                count={`${total} grade${total !== 1 ? 's' : ''}`}
                onClick={() => setSelectedSubjectName(subName)}
              />
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
        <GradeEntry
          classes={classes}
          subjects={subjects}
          initialClassId={activeClassId}
          onSuccess={() => { setShowModal(false); loadGrades(); }}
        />
      </Modal>
    </div>
  );
}

function FolderCard({ icon, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary-200 border border-transparent transition-all cursor-pointer text-center"
    >
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
      <p className="text-xs text-gray-400">{count}</p>
    </button>
  );
}

function Breadcrumb({ parts }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">›</span>}
          {p.onClick ? (
            <button onClick={p.onClick} className="text-primary-600 hover:underline font-medium">
              {p.label}
            </button>
          ) : (
            <span className="text-gray-800 font-semibold">{p.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

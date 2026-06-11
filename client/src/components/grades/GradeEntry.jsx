import { useState, useEffect } from 'react';
import { gradesApi } from '../../api/gradesApi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const EXAM_TYPES = [
  { code: 'test',     label: 'Test',      max: 100 },
  { code: 'quiz',     label: 'Quiz',      max: 10  },
  { code: 'midterm',  label: 'Midterm',   max: 100 },
  { code: 'final',    label: 'Final Exam',max: 100 },
  { code: 'homework', label: 'Homework',  max: null }, // pass/fail
];

export default function GradeEntry({ classes, subjects, onSuccess, initialClassId, initialSubjectId }) {
  const [step, setStep] = useState(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId ? String(initialSubjectId) : null);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId ? String(initialClassId) : String(classes[0]?.id || ''));
  const [examTypeIds, setExamTypeIds] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    gradesApi.getExamTypes().then((r) => {
      const map = {};
      (r.data.data || []).forEach((et) => { map[et.code] = et.id; });
      setExamTypeIds(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialSubjectId) {
      handleSelectSubject(String(initialSubjectId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSubjectId]);

  const activeClass = classes.find((c) => String(c.id) === String(selectedClassId)) || classes[0];
  const students = activeClass?.students || [];

  async function handleSelectSubject(subjectId) {
    setSelectedSubjectId(subjectId);
    setLoadingGrades(true);
    try {
      const r = await gradesApi.getMyGrades({ classId: selectedClassId || activeClass?.id, subjectId });
      const existing = r.data.data || [];
      const inputs = {};
      students.forEach((s) => {
        inputs[s.id] = {};
        EXAM_TYPES.forEach((et) => {
          const found = existing.find((g) => g.student_id === s.id && g.exam_type === et.code);
          const baseDate = found?.date ? new Date(found.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
          if (et.code === 'homework') {
            inputs[s.id][et.code] = {
              value: found ? (found.grade >= 1 ? 'pass' : 'fail') : null,
              gradeId: found?.id || null,
              date: baseDate,
              notes: found?.notes || '',
            };
          } else {
            inputs[s.id][et.code] = {
              value: found ? String(found.grade) : '',
              gradeId: found?.id || null,
              date: baseDate,
              notes: found?.notes || '',
            };
          }
        });
      });
      setGradeInputs(inputs);
      setStep(2);
    } catch {
      toast.error('Failed to load existing grades.');
    } finally {
      setLoadingGrades(false);
    }
  }

  function setCell(studentId, examCode, field, val) {
    setGradeInputs((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examCode]: { ...prev[studentId]?.[examCode], [field]: val },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const promises = [];

    students.forEach((s) => {
      EXAM_TYPES.forEach((et) => {
        const cell = gradeInputs[s.id]?.[et.code];
        if (!cell) return;
        const examTypeId = examTypeIds[et.code];
        if (!examTypeId) return;

        let gradeVal, maxGrade;

        if (et.code === 'homework') {
          if (!cell.value) return;
          gradeVal = cell.value === 'pass' ? 1 : 0;
          maxGrade = 1;
        } else {
          if (cell.value === '' || cell.value === undefined) return;
          gradeVal = parseFloat(cell.value);
          if (isNaN(gradeVal)) return;
          maxGrade = et.max;
        }

        const payload = { grade: gradeVal, max_grade: maxGrade, date: cell.date || today, exam_type_id: examTypeId, notes: cell.notes || '' };

        if (cell.gradeId) {
          promises.push(gradesApi.update(cell.gradeId, payload));
        } else {
          promises.push(gradesApi.create({ ...payload, student_id: s.id, subject_id: parseInt(selectedSubjectId) }));
        }
      });
    });

    if (!promises.length) { toast.error('No grades to save.'); setSaving(false); return; }

    try {
      await Promise.all(promises);
      toast.success(`Saved ${promises.length} grade(s).`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save some grades.');
    } finally {
      setSaving(false);
    }
  }

  // Step 1 — class selector + subject buttons
  if (step === 1) {
    return (
      <div className="space-y-5">
        {!initialClassId && (
          <div>
            <label className="label">Class</label>
            <div className="flex flex-wrap gap-2">
              {classes.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClassId(String(c.id))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    String(selectedClassId) === String(c.id)
                      ? 'bg-primary-600 text-white border-primary-600 shadow'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="label">Select Subject *</label>
          {loadingGrades ? (
            <p className="text-sm text-gray-400 py-4">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSubject(s.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm transition-all text-left group"
                >
                  <span className="text-2xl">📚</span>
                  <span className="font-medium text-gray-800 group-hover:text-primary-700 text-sm">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2 — grade table
  const subjectName = subjects.find((s) => String(s.id) === String(selectedSubjectId))?.name;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(1)} className="text-sm text-primary-600 hover:underline">← Back</button>
        <span className="text-sm text-gray-500">{activeClass?.name} — <strong>{subjectName}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 min-w-[120px]">Student</th>
              {EXAM_TYPES.map((et) => (
                <th key={et.code} className="text-center px-2 py-2 text-xs font-semibold text-gray-500 uppercase min-w-[110px]">
                  {et.label}
                  {et.max && <span className="block text-gray-400 normal-case font-normal">/{et.max}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 && (
              <tr><td colSpan={EXAM_TYPES.length + 1} className="text-center py-6 text-gray-400 text-sm">No students.</td></tr>
            )}
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-white">{s.name}</td>
                {EXAM_TYPES.map((et) => {
                  const cell = gradeInputs[s.id]?.[et.code];
                  const isExisting = !!cell?.gradeId;

                  if (et.code === 'homework') {
                    const val = cell?.value;
                    return (
                      <td key={et.code} className="px-2 py-2 text-center">
                        <div className="flex gap-1 justify-center">
                          <button
                            type="button"
                            onClick={() => setCell(s.id, et.code, 'value', val === 'pass' ? null : 'pass')}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${
                              val === 'pass'
                                ? 'bg-green-500 text-white border-green-600'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-green-400'
                            }`}
                          >✓</button>
                          <button
                            type="button"
                            onClick={() => setCell(s.id, et.code, 'value', val === 'fail' ? null : 'fail')}
                            className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${
                              val === 'fail'
                                ? 'bg-red-500 text-white border-red-600'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-red-400'
                            }`}
                          >✗</button>
                        </div>
                        <input
                          type="text"
                          placeholder="note..."
                          value={cell?.notes ?? ''}
                          onChange={(e) => setCell(s.id, et.code, 'notes', e.target.value)}
                          className="mt-1 w-full rounded border border-gray-200 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
                        />
                      </td>
                    );
                  }

                  return (
                    <td key={et.code} className="px-2 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        max={et.max}
                        step={et.code === 'quiz' ? 1 : 0.5}
                        placeholder="—"
                        value={cell?.value ?? ''}
                        onChange={(e) => setCell(s.id, et.code, 'value', e.target.value)}
                        className={`w-16 text-center rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                          isExisting ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="note..."
                        value={cell?.notes ?? ''}
                        onChange={(e) => setCell(s.id, et.code, 'notes', e.target.value)}
                        className="mt-1 w-full rounded border border-gray-200 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-400">
          <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-300 mr-1 align-middle" />
          Blue = existing grade (will update)
        </p>
        <Button onClick={handleSave} loading={saving}>💾 Save Grades</Button>
      </div>
    </div>
  );
}

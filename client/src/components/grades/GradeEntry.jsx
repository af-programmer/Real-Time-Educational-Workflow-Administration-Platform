import { useState, useEffect } from 'react';
import { gradesApi } from '../../api/gradesApi';
import toast from 'react-hot-toast';
import GradeEntryStep1 from './GradeEntryStep1';
import GradeEntryStep2 from './GradeEntryStep2';

const EXAM_TYPES = [
  { code: 'test',     label: 'Test',      max: 100 },
  { code: 'quiz',     label: 'Quiz',      max: 10  },
  { code: 'midterm',  label: 'Midterm',   max: 100 },
  { code: 'final',    label: 'Final Exam',max: 100 },
  { code: 'homework', label: 'Homework',  max: null },
];

export default function GradeEntry({ classes, subjects, onSuccess, initialClassId, initialSubjectId }) {
  const [step, setStep] = useState(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId ? String(initialSubjectId) : null);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId ? String(initialClassId) : String(classes[0]?.id || ''));
  const [examTypeIds, setExamTypeIds] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [gradeInputs, setGradeInputs] = useState({});

  const activeClass = classes.find((c) => String(c.id) === String(selectedClassId)) || classes[0];
  const students = activeClass?.students || [];

  useEffect(() => {
    gradesApi.getExamTypes().then((r) => {
      const map = {};
      (r.data.data || []).forEach((et) => { map[et.code] = et.id; });
      setExamTypeIds(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialSubjectId) handleSelectSubject(String(initialSubjectId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSubjectId]);

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
          inputs[s.id][et.code] = et.code === 'homework'
            ? { value: found ? (found.grade >= 1 ? 'pass' : 'fail') : null, gradeId: found?.id || null, date: baseDate, notes: found?.notes || '' }
            : { value: found ? String(found.grade) : '', gradeId: found?.id || null, date: baseDate, notes: found?.notes || '' };
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
    setGradeInputs((prev) => ({ ...prev, [studentId]: { ...prev[studentId], [examCode]: { ...prev[studentId]?.[examCode], [field]: val } } }));
  }

  async function handleSave() {
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const promises = [];
    students.forEach((s) => {
      EXAM_TYPES.forEach((et) => {
        const cell = gradeInputs[s.id]?.[et.code];
        const examTypeId = examTypeIds[et.code];
        if (!cell || !examTypeId) return;
        let gradeVal, maxGrade;
        if (et.code === 'homework') {
          if (!cell.value) return;
          gradeVal = cell.value === 'pass' ? 1 : 0; maxGrade = 1;
        } else {
          if (cell.value === '' || cell.value === undefined) return;
          gradeVal = parseFloat(cell.value);
          if (isNaN(gradeVal)) return;
          maxGrade = et.max;
        }
        const payload = { grade: gradeVal, max_grade: maxGrade, date: cell.date || today, exam_type_id: examTypeId, notes: cell.notes || '' };
        promises.push(cell.gradeId
          ? gradesApi.update(cell.gradeId, payload)
          : gradesApi.create({ ...payload, student_id: s.id, subject_id: parseInt(selectedSubjectId) })
        );
      });
    });
    if (!promises.length) { toast.error('No grades to save.'); setSaving(false); return; }
    try {
      await Promise.all(promises);
      toast.success(`Saved ${promises.length} grade(s).`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save some grades.');
    } finally { setSaving(false); }
  }

  if (step === 1)
    return <GradeEntryStep1 classes={classes} subjects={subjects} selectedClassId={selectedClassId} onSelectClass={setSelectedClassId} loadingGrades={loadingGrades} onSelectSubject={handleSelectSubject} initialClassId={initialClassId} />;

  const subjectName = subjects.find((s) => String(s.id) === String(selectedSubjectId))?.name;
  return <GradeEntryStep2 students={students} activeClass={activeClass} subjectName={subjectName} gradeInputs={gradeInputs} onCellChange={setCell} saving={saving} onSave={handleSave} onBack={() => setStep(1)} examTypes={EXAM_TYPES} />;
}

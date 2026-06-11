import { useState, useEffect, useMemo } from 'react';
import { useMyClasses } from '../../hooks/useGrades';
import { gradesApi } from '../../api/gradesApi';
import Spinner from '../../components/common/Spinner';
import GradeExamView from '../../components/grades/GradeExamView';
import GradeSubjectView from '../../components/grades/GradeSubjectView';
import GradeClassView from '../../components/grades/GradeClassView';

export default function MyGrades() {
  const { data: classes, loading: classesLoading } = useMyClasses();
  const [subjects, setSubjects] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
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

  const tree = useMemo(() => {
    const map = {};
    allGrades.forEach((g) => {
      if (!map[g.class_id]) map[g.class_id] = {};
      if (!map[g.class_id][g.subject_name]) map[g.class_id][g.subject_name] = {};
      if (!map[g.class_id][g.subject_name][g.exam_type]) map[g.class_id][g.subject_name][g.exam_type] = [];
      map[g.class_id][g.subject_name][g.exam_type].push(g);
    });
    return map;
  }, [allGrades]);

  if (classesLoading) return <Spinner className="py-20" />;

  const activeClassId = selectedClassId ?? classes[0]?.id;
  const classSubjects = tree[activeClassId] || {};
  const className = classes.find((c) => c.id === activeClassId)?.name;
  const shared = { classes, subjects, activeClassId, onGradeEntered: loadGrades };

  if (selectedExamType && selectedSubjectName)
    return <GradeExamView
      grades={classSubjects[selectedSubjectName]?.[selectedExamType] || []}
      examType={selectedExamType} subjectName={selectedSubjectName} className={className}
      onBackToClass={() => { setSelectedSubjectName(null); setSelectedExamType(null); }}
      onBackToSubject={() => setSelectedExamType(null)}
      {...shared}
    />;

  if (selectedSubjectName)
    return <GradeSubjectView
      subjectExamTypes={classSubjects[selectedSubjectName] || {}}
      subjectName={selectedSubjectName} className={className}
      onBackToClass={() => { setSelectedSubjectName(null); setSelectedExamType(null); }}
      onSelectExamType={setSelectedExamType}
      {...shared}
    />;

  return (
    <GradeClassView
      classSubjects={classSubjects} gradesLoading={gradesLoading}
      onSelectClass={(id) => { setSelectedClassId(id); setSelectedSubjectName(null); setSelectedExamType(null); }}
      onSelectSubject={setSelectedSubjectName}
      {...shared}
    />
  );
}

import { useState } from 'react';
import { useMyClasses } from '../../hooks/useGrades';
import { gradesApi } from '../../api/gradesApi';
import { useEffect } from 'react';
import GradeTable from '../../components/grades/GradeTable';
import GradeEntry from '../../components/grades/GradeEntry';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

export default function MyGrades() {
  const { data: classes, loading: classesLoading } = useMyClasses();
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ classId: '', subjectId: '' });

  useEffect(() => {
    gradesApi.getMySubjects().then((r) => setSubjects(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setGradesLoading(true);
    gradesApi.getMyGrades(filters)
      .then((r) => setGrades(r.data.data || []))
      .catch(() => {})
      .finally(() => setGradesLoading(false));
  }, [filters]);

  const refreshGrades = () => {
    setGradesLoading(true);
    gradesApi.getMyGrades(filters)
      .then((r) => setGrades(r.data.data || []))
      .catch(() => {})
      .finally(() => setGradesLoading(false));
  };

  if (classesLoading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-5">
      {/* Filters + Actions */}
      <div className="card p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="label">Filter by Class</label>
          <select
            value={filters.classId}
            onChange={(e) => setFilters((f) => ({ ...f, classId: e.target.value }))}
            className="input"
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Filter by Subject</label>
          <select
            value={filters.subjectId}
            onChange={(e) => setFilters((f) => ({ ...f, subjectId: e.target.value }))}
            className="input"
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={() => setShowModal(true)} className="ml-auto">
          + Enter Grade
        </Button>
      </div>

      {/* Grades Table */}
      <div className="card overflow-hidden">
        <GradeTable grades={grades} loading={gradesLoading} />
      </div>

      {/* Grade Entry Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Grade" size="md">
        <GradeEntry
          classes={classes}
          subjects={subjects}
          onSuccess={() => {
            setShowModal(false);
            refreshGrades();
          }}
        />
      </Modal>
    </div>
  );
}

import { useClassesStudents } from '../../hooks/useClassesStudents';
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';
import StudentGradesModal from './StudentGradesModal';
import Spinner from './Spinner';

export default function ClassesStudents({ filterClassIds = null, readOnly = false }) {
  const { classes, selectedClass, students, loadingClasses, loadingStudents, showForm, setShowForm, editStudent, setEditStudent, gradesStudent, setGradesStudent, search, setSearch, loadStudents, handleSaved, printRoster } = useClassesStudents(filterClassIds);

  if (loadingClasses) return <Spinner className="py-20" />;

  return (
    <div className="flex gap-5">
      <div className="w-56 flex-shrink-0 space-y-2">
        {classes.map((cls) => (
          <button key={cls.id} onClick={() => loadStudents(cls)}
            className={`w-full text-left card p-3 hover:shadow-md transition-all ${selectedClass?.id === cls.id ? 'ring-2 ring-primary-400' : ''}`}>
            <p className="font-bold text-gray-900">{cls.name}</p>
            <p className="text-xs text-gray-500">{cls.grade_level} · {cls.student_count} pupils</p>
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4">
        {!selectedClass ? (
          <div className="card p-12 text-center text-gray-400">
            <div className="text-5xl mb-3">🏫</div>
            <p>Select a class to view students</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-gray-900 text-lg shrink-0">Class {selectedClass.name}</h3>
              <input type="text" placeholder="Search by name, ID or student #…" value={search}
                onChange={(e) => setSearch(e.target.value)} className="input flex-1 text-sm" />
              <div className="flex gap-2 shrink-0">
                <button onClick={printRoster} className="btn-ghost text-sm">🖨️ Print Roster</button>
                {!readOnly && (
                  <button onClick={() => { setShowForm(true); setEditStudent(null); }}
                    className="btn-primary text-sm px-4 py-2">+ Add Student</button>
                )}
              </div>
            </div>

            {!readOnly && (showForm || editStudent) && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-900 mb-4">{editStudent ? 'Edit Student' : 'Add New Student'}</h4>
                <StudentForm classId={selectedClass.id} student={editStudent} classes={classes}
                  onSave={handleSaved} onCancel={() => { setShowForm(false); setEditStudent(null); }} />
              </div>
            )}

            {loadingStudents ? <Spinner className="py-8" /> : (
              <StudentTable students={students} readOnly={readOnly} search={search}
                onEditStudent={(s) => { setEditStudent(s); setShowForm(false); }}
                onViewGrades={(s) => setGradesStudent(s)} />
            )}
          </>
        )}
      </div>

      {gradesStudent && <StudentGradesModal student={gradesStudent} onClose={() => setGradesStudent(null)} />}
    </div>
  );
}

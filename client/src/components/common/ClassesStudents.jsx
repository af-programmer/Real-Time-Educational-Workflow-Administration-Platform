import { useState, useEffect } from 'react';
import { classesStudentsApi } from '../../api/printRequestsApi';
import StudentForm from './StudentForm';
import StudentGradesModal from './StudentGradesModal';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

export default function ClassesStudents() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [gradesStudent, setGradesStudent] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    classesStudentsApi.getAllClasses()
      .then((r) => setClasses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingClasses(false));
  }, []);

  async function loadStudents(cls) {
    setSelectedClass(cls);
    setLoadingStudents(true);
    setShowForm(false);
    setEditStudent(null);
    setSearch('');
    try {
      const r = await classesStudentsApi.getStudents(cls.id);
      setStudents(r.data.data || []);
    } catch { toast.error('Failed to load students.'); }
    finally { setLoadingStudents(false); }
  }

  function handleSaved() {
    setShowForm(false);
    setEditStudent(null);
    if (selectedClass) loadStudents(selectedClass);
  }

  function printRoster() {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${selectedClass.name} Roster</title>
      <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f3f4f6}</style></head>
      <body><h2>Class ${selectedClass.name} — Student Roster</h2>
      <table><thead><tr>
        <th>#</th><th>Name</th><th>ID Number</th><th>Student #</th>
        <th>Father's Phone</th><th>Mother's Phone</th><th>Home Phone</th><th>Parent Email</th>
      </tr></thead>
      <tbody>${students.map((s, i) => `<tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.id_number    || '—'}</td>
        <td>${s.student_number || '—'}</td>
        <td>${s.phone_father || '—'}</td>
        <td>${s.phone_mother || '—'}</td>
        <td>${s.phone_home   || '—'}</td>
        <td>${s.parent_email || '—'}</td>
      </tr>`).join('')}
      </tbody></table></body></html>`);
    win.document.close();
    win.print();
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.id_number     || '').toLowerCase().includes(q) ||
      (s.student_number || '').toLowerCase().includes(q)
    );
  });

  if (loadingClasses) return <Spinner className="py-20" />;

  return (
    <div className="flex gap-5">
      {/* Class list */}
      <div className="w-56 flex-shrink-0 space-y-2">
        {classes.map((cls) => (
          <button key={cls.id} onClick={() => loadStudents(cls)}
            className={`w-full text-left card p-3 hover:shadow-md transition-all ${selectedClass?.id === cls.id ? 'ring-2 ring-primary-400' : ''}`}>
            <p className="font-bold text-gray-900">{cls.name}</p>
            <p className="text-xs text-gray-500">{cls.grade_level} · {cls.student_count} pupils</p>
          </button>
        ))}
      </div>

      {/* Students panel */}
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
              <input
                type="text"
                placeholder="Search by name, ID or student #…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input flex-1 text-sm"
              />
              <div className="flex gap-2 shrink-0">
                <button onClick={printRoster} className="btn-ghost text-sm">🖨️ Print Roster</button>
                <button onClick={() => { setShowForm(true); setEditStudent(null); }}
                  className="btn-primary text-sm px-4 py-2">+ Add Student</button>
              </div>
            </div>

            {(showForm || editStudent) && (
              <div className="card p-5">
                <h4 className="font-semibold text-gray-900 mb-4">{editStudent ? 'Edit Student' : 'Add New Student'}</h4>
                <StudentForm classId={selectedClass.id} student={editStudent} classes={classes}
                  onSave={handleSaved} onCancel={() => { setShowForm(false); setEditStudent(null); }} />
              </div>
            )}

            {loadingStudents ? <Spinner className="py-8" /> : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['#', 'Name', 'ID Number', 'Student #', "Father's Phone", "Mother's Phone", 'Home Phone', 'Email', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <button
                            onClick={() => setGradesStudent(s)}
                            className="text-primary-700 hover:underline text-left"
                          >
                            {s.name}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.id_number     || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.student_number || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.phone_father  || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.phone_mother  || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.phone_home    || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{s.parent_email  || '—'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setEditStudent(s); setShowForm(false); }}
                            className="text-primary-600 hover:text-primary-800 text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="text-center py-8 text-gray-400 text-sm">
                    {search ? 'No students match your search.' : 'No students yet.'}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {gradesStudent && (
        <StudentGradesModal student={gradesStudent} onClose={() => setGradesStudent(null)} />
      )}
    </div>
  );
}

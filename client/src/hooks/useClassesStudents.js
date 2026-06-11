import { useState, useEffect } from 'react';
import { classesStudentsApi } from '../api/usersApi';
import toast from 'react-hot-toast';

export function useClassesStudents(filterClassIds = null) {
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
      .then((r) => {
        const all = r.data.data || [];
        setClasses(filterClassIds ? all.filter((c) => filterClassIds.includes(c.id)) : all);
      })
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
        <td>${i + 1}</td><td>${s.name}</td>
        <td>${s.id_number || '—'}</td><td>${s.student_number || '—'}</td>
        <td>${s.phone_father || '—'}</td><td>${s.phone_mother || '—'}</td>
        <td>${s.phone_home || '—'}</td><td>${s.parent_email || '—'}</td>
      </tr>`).join('')}
      </tbody></table></body></html>`);
    win.document.close();
    win.print();
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.id_number || '').toLowerCase().includes(q) || (s.student_number || '').toLowerCase().includes(q);
  });

  return { classes, selectedClass, students: filtered, loadingClasses, loadingStudents, showForm, setShowForm, editStudent, setEditStudent, gradesStudent, setGradesStudent, search, setSearch, loadStudents, handleSaved, printRoster };
}

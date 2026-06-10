import { useState, useEffect } from 'react';
import { classesStudentsApi } from '../../api/printRequestsApi';
import Spinner from './Spinner';

export default function StudentGradesModal({ student, onClose }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classesStudentsApi.getStudentGrades(student.id)
      .then((r) => setGrades(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [student.id]);

  // Group by subject
  const bySubject = grades.reduce((acc, g) => {
    if (!acc[g.subject_name]) acc[g.subject_name] = [];
    acc[g.subject_name].push(g);
    return acc;
  }, {});

  const avg = (list) => {
    const val = list.reduce((s, g) => s + parseFloat(g.grade), 0) / list.length;
    return val.toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
            <p className="text-xs text-gray-400">
              {student.id_number ? `ID: ${student.id_number} · ` : ''}
              Student #{student.student_number}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="overflow-auto flex-1 p-4 space-y-4">
          {loading ? (
            <Spinner className="py-12" />
          ) : grades.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No grades recorded yet.</p>
          ) : (
            Object.entries(bySubject).map(([subject, list]) => (
              <div key={subject} className="card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-primary-50">
                  <span className="font-semibold text-primary-800">{subject}</span>
                  <span className="text-sm text-primary-600">Avg: {avg(list)}</span>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Type', 'Grade', 'Max', 'Teacher', 'Notes'].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-gray-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {list.map((g) => (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-600">{g.date?.slice(0, 10)}</td>
                        <td className="px-3 py-2 text-gray-600 capitalize">{g.exam_type}</td>
                        <td className="px-3 py-2 font-semibold text-gray-900">{g.grade}</td>
                        <td className="px-3 py-2 text-gray-400">{g.max_grade}</td>
                        <td className="px-3 py-2 text-gray-600">{g.teacher_name}</td>
                        <td className="px-3 py-2 text-gray-400">{g.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

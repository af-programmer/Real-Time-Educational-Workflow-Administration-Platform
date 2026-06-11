export default function StudentTable({ students, readOnly, onEditStudent, onViewGrades, search }) {
  const cols = ['#', 'Name', 'ID Number', 'Student #', "Father's Phone", "Mother's Phone", 'Home Phone', 'Email', ...(readOnly ? [] : [''])];
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {cols.map((h) => <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {students.map((s, i) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-400">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">
                <button onClick={() => onViewGrades(s)} className="text-primary-700 hover:underline text-left">{s.name}</button>
              </td>
              <td className="px-4 py-3 text-gray-600">{s.id_number || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{s.student_number || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{s.phone_father || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{s.phone_mother || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{s.phone_home || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{s.parent_email || '—'}</td>
              {!readOnly && (
                <td className="px-4 py-3">
                  <button onClick={() => onEditStudent(s)} className="text-primary-600 hover:text-primary-800 text-xs">Edit</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <p className="text-center py-8 text-gray-400 text-sm">
          {search ? 'No students match your search.' : 'No students yet.'}
        </p>
      )}
    </div>
  );
}

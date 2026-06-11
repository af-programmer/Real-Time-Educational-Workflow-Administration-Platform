export default function GradeTableRow({ student, examTypes, gradeInputs, onCellChange }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-white">{student.name}</td>
      {examTypes.map((et) => {
        const cell = gradeInputs[student.id]?.[et.code];
        const isExisting = !!cell?.gradeId;

        if (et.code === 'homework') {
          const val = cell?.value;
          return (
            <td key={et.code} className="px-2 py-2 text-center">
              <div className="flex gap-1 justify-center">
                <button type="button" onClick={() => onCellChange(student.id, et.code, 'value', val === 'pass' ? null : 'pass')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${val === 'pass' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-400 border-gray-200 hover:border-green-400'}`}>✓</button>
                <button type="button" onClick={() => onCellChange(student.id, et.code, 'value', val === 'fail' ? null : 'fail')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all ${val === 'fail' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-400 border-gray-200 hover:border-red-400'}`}>✗</button>
              </div>
              <input type="text" placeholder="note..." value={cell?.notes ?? ''} onChange={(e) => onCellChange(student.id, et.code, 'notes', e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400" />
            </td>
          );
        }

        return (
          <td key={et.code} className="px-2 py-1 text-center">
            <input type="number" min="0" max={et.max} step={et.code === 'quiz' ? 1 : 0.5} placeholder="—"
              value={cell?.value ?? ''} onChange={(e) => onCellChange(student.id, et.code, 'value', e.target.value)}
              className={`w-16 text-center rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${isExisting ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white'}`} />
            <input type="text" placeholder="note..." value={cell?.notes ?? ''} onChange={(e) => onCellChange(student.id, et.code, 'notes', e.target.value)}
              className="mt-1 w-full rounded border border-gray-200 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400" />
          </td>
        );
      })}
    </tr>
  );
}

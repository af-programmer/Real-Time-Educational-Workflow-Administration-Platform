import GradeTableRow from './GradeTableRow';
import Button from '../common/Button';

export default function GradeEntryStep2({ students, activeClass, subjectName, gradeInputs, onCellChange, saving, onSave, onBack, examTypes }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-primary-600 hover:underline">← Back</button>
        <span className="text-sm text-gray-500">{activeClass?.name} — <strong>{subjectName}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 min-w-[120px]">Student</th>
              {examTypes.map((et) => (
                <th key={et.code} className="text-center px-2 py-2 text-xs font-semibold text-gray-500 uppercase min-w-[110px]">
                  {et.label}
                  {et.max && <span className="block text-gray-400 normal-case font-normal">/{et.max}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 && (
              <tr><td colSpan={examTypes.length + 1} className="text-center py-6 text-gray-400 text-sm">No students.</td></tr>
            )}
            {students.map((s) => (
              <GradeTableRow key={s.id} student={s} examTypes={examTypes} gradeInputs={gradeInputs} onCellChange={onCellChange} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-400">
          <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-300 mr-1 align-middle" />
          Blue = existing grade (will update)
        </p>
        <Button onClick={onSave} loading={saving}>💾 Save Grades</Button>
      </div>
    </div>
  );
}

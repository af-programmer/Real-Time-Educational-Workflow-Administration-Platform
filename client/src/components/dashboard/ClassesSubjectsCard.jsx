export default function ClassesSubjectsCard({ profile }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-4">My Classes & Subjects</h3>
      {profile?.classes?.length ? (
        <div className="space-y-2">
          {profile.classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{cls.name}</p>
                <p className="text-xs text-gray-500">{cls.grade_level}</p>
              </div>
              <span className="text-sm text-gray-500">{cls.student_count} students</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No classes assigned yet.</p>
      )}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {profile?.subjects?.map((s) => (
            <span key={s.id} className="text-xs bg-primary-100 text-primary-700 rounded-full px-3 py-1">
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

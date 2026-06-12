export default function ClassesSubjectsCard({ profile, isHomeroom, onClassClick }) {
  const classes = profile?.classes || [];
  const subjects = profile?.subjects || [];

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-4">My Classes & Subjects</h3>

      {classes.length ? (
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  {onClassClick ? (
                    <button
                      onClick={() => onClassClick(cls)}
                      className="font-semibold text-primary-700 hover:underline text-left"
                    >
                      {cls.name}
                    </button>
                  ) : (
                    <p className="font-semibold text-gray-900">{cls.name}</p>
                  )}
                  <p className="text-xs text-gray-500">{cls.grade_level} · {cls.student_count} students</p>
                </div>
              </div>
              {subjects.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <span key={s.id} className="text-xs bg-primary-100 text-primary-700 rounded-full px-2.5 py-0.5">
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No subjects assigned.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No classes assigned yet.</p>
      )}

      {!classes.length && subjects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Subjects</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <span key={s.id} className="text-xs bg-primary-100 text-primary-700 rounded-full px-3 py-1">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

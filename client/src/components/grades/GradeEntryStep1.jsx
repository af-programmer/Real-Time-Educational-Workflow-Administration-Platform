export default function GradeEntryStep1({ classes, subjects, selectedClassId, onSelectClass, loadingGrades, onSelectSubject, initialClassId }) {
  return (
    <div className="space-y-5">
      {!initialClassId && (
        <div>
          <label className="label">Class</label>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectClass(String(c.id))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  String(selectedClassId) === String(c.id)
                    ? 'bg-primary-600 text-white border-primary-600 shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="label">Select Subject *</label>
        {loadingGrades ? (
          <p className="text-sm text-gray-400 py-4">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-1">
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSubject(s.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm transition-all text-left group"
              >
                <span className="text-2xl">📚</span>
                <span className="font-medium text-gray-800 group-hover:text-primary-700 text-sm">{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

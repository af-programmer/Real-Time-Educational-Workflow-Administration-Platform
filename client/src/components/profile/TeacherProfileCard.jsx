import Badge from '../common/Badge';

export default function TeacherProfileCard({ profile }) {
  return (
    <div className="card p-6 flex flex-col sm:flex-row gap-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-3xl font-bold flex-shrink-0">
        {profile.name?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            {profile.phone && <p className="text-gray-500 text-sm">{profile.phone}</p>}
          </div>
          <div className="flex flex-col gap-2">
            {profile.role === 'Educator'
              ? <Badge label="EDUCATOR" variant="Educator" />
              : <Badge label="Professional Teacher" variant="professional_teacher" />}
            {profile.is_blocked && <Badge label="Blocked" variant="urgent" />}
            {!profile.is_active && <Badge label="Inactive" variant="pending" />}
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Classes</p>
            <div className="flex flex-wrap gap-1">
              {profile.classes?.map((c) => (
                <span key={c.id} className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                  {c.name} ({c.student_count})
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subjects</p>
            <div className="flex flex-wrap gap-1">
              {profile.subjects?.map((s) => (
                <span key={s.id} className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Badge from '../Badge';

function getRoleDisplay(role) {
  if (role === 'Educator') return { label: 'EDUCATOR', variant: 'Educator' };
  if (role === 'teacher') return { label: 'Professional Teacher', variant: 'professional_teacher' };
  return {
    label: role ? role.charAt(0).toUpperCase() + role.slice(1) : '',
    variant: role || 'default',
  };
}

export default function ProfileTab({ user, currentAvatar }) {
  const { label: roleLabel, variant: roleVariant } = getRoleDisplay(user?.role);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {currentAvatar ? (
          <img src={currentAvatar} alt={user?.name} className="h-16 w-16 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-2xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm pt-1">
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Role</p>
          <Badge label={roleLabel} variant={roleVariant} />
        </div>
        {user?.phone && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Phone</p>
            <p className="text-gray-700">{user.phone}</p>
          </div>
        )}
        {user?.phone2 && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Phone 2</p>
            <p className="text-gray-700">{user.phone2}</p>
          </div>
        )}
      </div>
    </div>
  );
}

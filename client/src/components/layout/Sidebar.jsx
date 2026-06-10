import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import useAuthStore from '../../store/authStore';
import { useAuthActions } from '../../hooks/useAuth';
import { sidebarColors } from '../../styles/variantClasses';

const navItems = {
  teacher: [
    { to: '/teacher', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/teacher/print-requests', label: 'Print Requests', icon: '🖨️' },
    { to: '/teacher/new-print-request', label: 'New Request', icon: '➕' },
    { to: '/teacher/library', label: 'My Library', icon: '📚' },
    { to: '/teacher/grades', label: 'My Grades', icon: '📊' },
    { to: '/teacher/messages', label: 'Messages', icon: '✉️' },
  ],
  secretary: [
    { to: '/secretary', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/secretary/print-center', label: 'Print Center', icon: '🖨️' },
    { to: '/secretary/print-history', label: 'Print History', icon: '📋' },
    { to: '/secretary/classes', label: 'Classes & Students', icon: '🏫' },
    { to: '/secretary/teachers', label: 'Teachers', icon: '👩‍🏫' },
    { to: '/secretary/messages', label: 'Messages', icon: '✉️' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/admin/users', label: 'User Management', icon: '👥' },
    { to: '/admin/staff', label: 'Staff', icon: '👩‍💼' },
    { to: '/admin/classes', label: 'Classes', icon: '🏫' },
    { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { to: '/admin/messages', label: 'Messages', icon: '✉️' },
  ],
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuthStore();
  const { logout } = useAuthActions();

  const baseTeacherItems = [
    { to: '/teacher', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/teacher/print-requests', label: 'Print Requests', icon: '🖨️' },
    { to: '/teacher/new-print-request', label: 'New Request', icon: '➕' },
    { to: '/teacher/library', label: 'My Library', icon: '📚' },
    { to: '/teacher/grades', label: 'My Grades', icon: '📊' },
    { to: '/teacher/messages', label: 'Messages', icon: '✉️' },
  ];
  const teacherItems = user?.is_homeroom
    ? [...baseTeacherItems.slice(0, 4), { to: '/teacher/classes', label: 'My Classes', icon: '🏫' }, ...baseTeacherItems.slice(4)]
    : baseTeacherItems;

  const items = user?.role === 'teacher' ? teacherItems : (navItems[user?.role] || []);

  const SidebarContent = () => (
    <div className={clsx('flex flex-col h-full bg-gradient-to-b text-white', sidebarColors[user?.role] || sidebarColors.teacher)}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 font-bold text-lg">E</div>
        <div>
          <p className="font-bold text-base leading-none">EduFlow</p>
          <p className="text-xs text-white/60 mt-0.5 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-semibold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-64 flex-col flex">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

import NotificationBell from '../common/NotificationBell';
import useAuthStore from '../../store/authStore';

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 flex-1 truncate">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function getPageTitle(pathname) {
  const map = {
    '/teacher': 'Dashboard',
    '/teacher/print-requests': 'My Print Requests',
    '/teacher/new-print-request': 'New Print Request',
    '/teacher/grades': 'My Grades',
    '/teacher/messages': 'Messages',
    '/secretary': 'Dashboard',
    '/secretary/print-center': 'Print Center',
    '/secretary/teachers': 'Teachers',
    '/secretary/messages': 'Messages',
    '/admin': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/classes': 'Class Management',
    '/admin/announcements': 'Announcements',
    '/admin/messages': 'Messages',
  };
  return map[pathname] || 'EduFlow';
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

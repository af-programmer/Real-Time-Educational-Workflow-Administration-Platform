import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuthStore from '../store/authStore';

import Login from '../pages/Login';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MyPrintRequests from '../pages/teacher/MyPrintRequests';
import NewPrintRequest from '../pages/teacher/NewPrintRequest';
import MyGrades from '../pages/teacher/MyGrades';
import MyClasses from '../pages/teacher/MyClasses';
import ClassRoster from '../pages/teacher/ClassRoster';
import MyMessages from '../pages/teacher/MyMessages';
import TeacherLibrary from '../pages/teacher/TeacherLibrary';
import SecretaryDashboard from '../pages/secretary/SecretaryDashboard';
import PrintCenter from '../pages/secretary/PrintCenter';
import PrintHistory from '../pages/secretary/PrintHistory';
import SecretaryClasses from '../pages/secretary/SecretaryClasses';
import TeachersList from '../pages/secretary/TeachersList';
import TeacherProfile from '../pages/secretary/TeacherProfile';
import SecretaryMessages from '../pages/secretary/SecretaryMessages';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import ClassManagement from '../pages/admin/ClassManagement';
import Announcements from '../pages/admin/Announcements';
import AdminMessages from '../pages/admin/AdminMessages';
import StaffList from '../pages/admin/StaffList';
import StaffProfile from '../pages/admin/StaffProfile';

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const roleHome = { admin: '/admin', secretary: '/secretary', teacher: '/teacher', Educator: '/teacher' };
  return <Navigate to={roleHome[user?.role] || '/login'} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute allowedRoles={['teacher', 'Educator']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/print-requests" element={<MyPrintRequests />} />
          <Route path="/teacher/new-print-request" element={<NewPrintRequest />} />
          <Route path="/teacher/library" element={<TeacherLibrary />} />
          <Route path="/teacher/grades" element={<MyGrades />} />
          <Route path="/teacher/classes" element={<MyClasses />} />
          <Route path="/teacher/classes/:classId/roster" element={<ClassRoster />} />
          <Route path="/teacher/messages" element={<MyMessages />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['secretary']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/secretary" element={<SecretaryDashboard />} />
          <Route path="/secretary/print-center" element={<PrintCenter />} />
          <Route path="/secretary/print-history" element={<PrintHistory />} />
          <Route path="/secretary/classes" element={<SecretaryClasses />} />
          <Route path="/secretary/teachers" element={<TeachersList />} />
          <Route path="/secretary/teachers/:id" element={<TeacherProfile />} />
          <Route path="/secretary/messages" element={<SecretaryMessages />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/classes" element={<ClassManagement />} />
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/staff" element={<StaffList />} />
          <Route path="/admin/staff/:id" element={<StaffProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

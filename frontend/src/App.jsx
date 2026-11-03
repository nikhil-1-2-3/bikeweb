import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout      from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import HomePage      from './pages/HomePage';
import ShowroomPage  from './pages/ShowroomPage';
import BikeDetailPage from './pages/BikeDetailPage';
import AboutPage     from './pages/AboutPage';
import ContactPage   from './pages/ContactPage';
import LoginPage     from './pages/LoginPage';
import SignupPage    from './pages/SignupPage';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyAppointments    from './pages/customer/MyAppointments';
import BookAppointment   from './pages/customer/BookAppointment';
import MyProfile         from './pages/customer/MyProfile';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import ManageMotorcycles from './pages/admin/ManageMotorcycles';
import AddMotorcycle     from './pages/admin/AddMotorcycle';
import EditMotorcycle    from './pages/admin/EditMotorcycle';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageCustomers   from './pages/admin/ManageCustomers';

export default function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/"               element={<HomePage />} />
        <Route path="/motorcycles"    element={<ShowroomPage />} />
        <Route path="/motorcycles/:id" element={<BikeDetailPage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/contact"        element={<ContactPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/signup"         element={<SignupPage />} />
      </Route>

      {/* Customer dashboard */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"              element={<CustomerDashboard />} />
        <Route path="/dashboard/appointments" element={<MyAppointments />} />
        <Route path="/dashboard/book"         element={<BookAppointment />} />
        <Route path="/dashboard/profile"      element={<MyProfile />} />
      </Route>

      {/* Admin dashboard */}
      <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
        <Route path="/admin"                        element={<AdminDashboard />} />
        <Route path="/admin/motorcycles"            element={<ManageMotorcycles />} />
        <Route path="/admin/motorcycles/add"        element={<AddMotorcycle />} />
        <Route path="/admin/motorcycles/:id/edit"   element={<EditMotorcycle />} />
        <Route path="/admin/appointments"           element={<ManageAppointments />} />
        <Route path="/admin/customers"              element={<ManageCustomers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// src/AppRouter.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import LoadingSpinner from './components/common/Loader';
import PrivateRoute from './components/auth/PrivateRoutes';
import NotFound from './components/common/NotFound';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import RegisterFace from './components/attendence/RegisterFace';
import FaceAttendance from './components/attendence/FaceAttendance;';
import NotesDashboard from './components/notes/NotesDashboard';
import HomePage from './home/Home';
import AuthLayout from './AuthLayout';
import Dashboard from './components/Dashboard';

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/register-face" element={<RegisterFace />} />
            <Route path="/attendance" element={<AuthLayout><FaceAttendance /></AuthLayout>} />
            <Route path="/notes" element={<NotesDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Route>

          {/* Redirects and 404 */}

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>

    </Router>
  );
};

export default AppRouter;
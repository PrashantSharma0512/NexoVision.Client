// src/components/auth/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../utils/auth';

const PrivateRoute = ({ roles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
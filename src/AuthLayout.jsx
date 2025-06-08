import React from 'react';
import { getCurrentRole } from './utils/auth';
import { Navigate, useNavigate } from 'react-router-dom';

function AuthLayout({ children }) {
    const role = (getCurrentRole() || '').trim().toLowerCase();

    return <>{role !== 'student' ? children : <Navigate to="/404" replace />}</>;
}

export default AuthLayout;

// src/routes.js
import { lazy } from 'react';

const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const RegisterFace = lazy(() => import('./components/attendence/RegisterFace'));
const FaceAttendance = lazy(() => import('./components/attendence/FaceAttendance;'));
const NotesDashboard = lazy(() => import('./components/notes/NotesDashboard'));

export const routes = [
    {
      path: '/login',
      component: 'Login',
      authRequired: false
    },
    {
      path: '/register',
      component: 'Register',
      authRequired: false
    },
    {
      path: '/register-face',
      component: 'RegisterFace',
      authRequired: true,
      roles: ['student']
    },
    {
      path: '/attendance',
      component: 'FaceAttendance',
      authRequired: true,
      roles: ['student']
    },
    {
      path: '/notes',
      component: 'NotesDashboard',
      authRequired: true,
      roles: ['student', 'teacher']
    },
    {
      path: '/loader',
      component: 'Loader',
      authRequired: true,
      roles: ['student', 'teacher']
    }
  ];
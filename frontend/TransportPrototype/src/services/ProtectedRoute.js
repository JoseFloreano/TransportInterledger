// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';

const ProtectedRoute = ({ children }) => {
  return AuthService.isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
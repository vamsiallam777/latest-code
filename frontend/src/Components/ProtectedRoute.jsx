import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return children;
  }

  // Redirect to appropriate dashboard based on role
  return <Navigate to="/dashboard" />;
};

export default ProtectedRoute;
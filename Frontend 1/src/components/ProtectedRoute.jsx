
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // In a real app, you'd have more robust auth state management (e.g., Context, Redux)
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

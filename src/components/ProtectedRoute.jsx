import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

/**
 * ProtectedRoute — gates child routes behind authentication.
 * - Loading → shows a loading screen
 * - Not authenticated → redirects to /login
 * - Authenticated → renders child routes via <Outlet />
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-icon">🎯</span>
          <span className="loading-text">Loading Actify...</span>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

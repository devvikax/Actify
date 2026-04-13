import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import logo from "../../assets/logo.png";

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tasks', icon: '📝', label: 'My Tasks' },
  { path: '/today', icon: '📅', label: "Today's Plan" },
  { path: '/progress', icon: '📈', label: 'Progress' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore errors — just redirect
    }
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
          <img src={logo} alt="logo" className="landing-logo-icon" />
          <span className="landing-logo-text">Actify</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.displayName?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {user?.displayName || 'Student'}
            </span>
            <span className="sidebar-user-email">
              {user?.email || 'user@email.com'}
            </span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}

import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tasks', icon: '📝', label: 'My Tasks' },
  { path: '/today', icon: '📅', label: "Today's Plan" },
  { path: '/progress', icon: '📈', label: 'Progress' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Will be implemented in Phase 2
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
          <span className="sidebar-logo-icon">🎯</span>
          <span className="sidebar-logo-text">PlanIt</span>
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
          <div className="sidebar-avatar">👤</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Student</span>
            <span className="sidebar-user-email">user@email.com</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}

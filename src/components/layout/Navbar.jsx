import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const pageTitles = {
  '/dashboard': '📊 Dashboard',
  '/tasks': '📝 My Tasks',
  '/today': "📅 Today's Plan",
  '/progress': '📈 Progress',
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const pageTitle = pageTitles[location.pathname] || 'PlanIt';
  const displayName = user?.displayName || 'Student';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button
            className="navbar-hamburger"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <h1 className="navbar-title">{pageTitle}</h1>
        </div>

        <div className="navbar-right">
          <span className="navbar-greeting">
            Hello, <strong>{displayName}</strong> 👋
          </span>
        </div>
      </div>
    </header>
  );
}

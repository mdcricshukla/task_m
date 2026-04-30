import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Task<span>Flow</span>
      </Link>

      <div className="navbar-links">
        {/* Quick Links Menu */}
        <div className="quick-links">
          <button 
            className="btn btn-ghost quick-links-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            Quick Links ▼
          </button>
          {showMenu && (
            <div className="quick-links-menu">
<Link to="/" onClick={() => setShowMenu(false)}>Home</Link>
              <Link to="/about" onClick={() => setShowMenu(false)}>About</Link>
              <Link to="/login" onClick={() => setShowMenu(false)}>Login</Link>
              <Link to="/register" onClick={() => setShowMenu(false)}>Register</Link>
              {user && (
                <>
                  <Link to="/dashboard" onClick={() => setShowMenu(false)}>Dashboard</Link>
                  <Link to="/projects" onClick={() => setShowMenu(false)}>Projects</Link>
                </>
              )}
              <a href="mailto:support@taskflow.com" onClick={() => setShowMenu(false)}>Contact</a>
            </div>
          )}
        </div>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

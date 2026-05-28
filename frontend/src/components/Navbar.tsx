import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.style.setProperty('--bg-primary', '#18141c'); // dark brown
      document.documentElement.style.setProperty('--bg-secondary', '#1a2233'); // dark blue
      document.documentElement.style.setProperty('--text-primary', '#f5f5f5');
      document.documentElement.style.setProperty('--text-secondary', '#b8b8b8');
      document.documentElement.style.setProperty('--border-color', '#2d2d2d');
      document.documentElement.style.setProperty('--accent-brown', '#4e342e');
      document.documentElement.style.setProperty('--accent-blue', '#223366');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#f5f5f7');
      document.documentElement.style.setProperty('--bg-secondary', '#e3e6ed');
      document.documentElement.style.setProperty('--text-primary', '#18141c');
      document.documentElement.style.setProperty('--text-secondary', '#4e342e');
      document.documentElement.style.setProperty('--border-color', '#d1cfcf');
      document.documentElement.style.setProperty('--accent-brown', '#6d4c41');
      document.documentElement.style.setProperty('--accent-blue', '#3b5998');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <span className="brand-name">Thuto BAC</span>
        </div>
        
        <div className="navbar-menu">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          {isAuthenticated ? (
            <>
              <div className="navbar-user-section">
                <div className="user-avatar">{user?.full_name?.charAt(0).toUpperCase() || 'U'}</div>
                <span className="navbar-user">{user?.full_name || 'User'}</span>
              </div>
              <button onClick={() => navigate('/elections')} className="navbar-link elections-link">
                Elections
              </button>
              <button onClick={handleLogout} className="navbar-link logout">
                Logout
              </button>
            </>
          ) : (
            <span className="navbar-login-note">Login from home page</span>
          )}
        </div>
      </div>
    </nav>
  );
};

import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Get Started', href: '#join' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('user');
  const isLanding = location.pathname === '/';
  const isStandaloneAuth = location.pathname === '/login' && !location.state?.backgroundLocation;
  const isWorkspace =
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/editor/') ||
    location.pathname.startsWith('/rooms/');

  const openAuth = (mode = 'login') => {
    navigate('/login', {
      state: {
        backgroundLocation: location,
        mode,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const buildSectionLink = (href) => (isLanding ? href : `/${href}`);

  if (isStandaloneAuth || isWorkspace) {
    return null;
  }

  return (
    <nav
      className={`navigation ${
        isLanding ? 'navigation--landing' : 'navigation--default'
      }`}
    >
      <div className="nav-container">
        <button type="button" className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-brand-mark">
            <img src="/thuto.png" alt="THABANG Library logo" className="nav-logo-image" />
          </span>
          <span className="nav-brand-copy">
            <strong>THABANG Library</strong>
            <span>Digital Library Workspace</span>
          </span>
        </button>

        {isLanding && (
          <div className="nav-links">
            {navLinks.map((link) => (
              <a className="nav-link" href={buildSectionLink(link.href)} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="nav-actions">
          {user ? (
            <>
              <button className="nav-link nav-link-button" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-link nav-link-button" onClick={() => openAuth('login')}>
                Sign In
              </button>
              <button className="btn-signup" onClick={() => openAuth('signup')}>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

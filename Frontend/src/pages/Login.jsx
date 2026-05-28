import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconArrow } from '../components/Icons';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedMode = location.state?.mode === 'signup' ? 'signup' : 'login';
  const requestedRole = location.state?.role === 'super-admin' ? 'super-admin' : 'user';
  const isModal = Boolean(location.state?.backgroundLocation);
  const [isLogin, setIsLogin] = useState(requestedMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: requestedRole,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(requestedMode === 'login');
  }, [requestedMode]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      role: requestedRole,
    }));
  }, [requestedRole]);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isModal) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData((current) => ({
      ...current,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate auth
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: formData.email,
        name: formData.name || (formData.role === 'super-admin' ? 'Super Admin' : 'Library User'),
        role: formData.role,
      }));
      navigate(location.state?.from || '/dashboard', { replace: true });
    }, 1000);
  };

  const handleClose = () => {
    if (isModal) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div
      className={`login-wrapper ${isModal ? 'login-wrapper--modal' : 'login-wrapper--standalone'}`}
      onClick={handleClose}
    >
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-close"
          onClick={handleClose}
          aria-label="Close authentication dialog"
        >
          ×
        </button>

        <div className="login-left">
          <div className="login-content">
            <img src="/thuto.png" alt="THUTOSHARE" className="login-title-image" />
            <p className="login-subtitle">A focused digital space for reading, sharing, and trusted access.</p>
            <div className="login-benefits">
              <div className="benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span>Collections stay structured and easy to browse.</span>
              </div>
              <div className="benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Readers and teams move through shared work without friction.</span>
              </div>
              <div className="benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Access stays controlled while the interface stays calm.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <span className="login-kicker">{isLogin ? 'Sign In' : 'Create Account'}</span>
              <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
              <p>
                {isLogin
                  ? 'Open your workspace and continue where you left off.'
                  : 'Join THUTOSHARE through a cleaner, more focused sign-up flow.'}
              </p>
            </div>

            <div className="login-role-switch" aria-label="Choose workspace role">
              <span className="login-role-label">Workspace</span>
              <div className="login-role-options">
                <button
                  type="button"
                  className={`login-role-button ${formData.role === 'user' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('user')}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`login-role-button ${formData.role === 'super-admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('super-admin')}
                >
                  Super Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <IconArrow />}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="toggle-auth"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

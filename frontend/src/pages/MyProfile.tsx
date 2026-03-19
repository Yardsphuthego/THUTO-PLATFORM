import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PROFILE_STYLES = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }
  :root {
    --page:#f5f3ef; --ink:#0a0a12; --cream:#faf8f4;
    --gold:#c8a84b; --gold-light:#e6c96d; --gold-dim:rgba(200,168,75,.15);
    --indigo:#01001d; --indigo-mid:#0a0a2e;
    --accent:#e84855; --accent2:#3ecf8e; --muted:#8a8880;
    --card:#ffffff; --border:rgba(10,10,18,.08);
    --shadow:0 4px 32px rgba(10,10,18,.08);
    --shadow-lg:0 12px 60px rgba(10,10,18,.14);
    --sidebar-w:260px; --radius:16px;
    --sidebar-bg1:#01001d; --sidebar-bg2:#05051a;
    --nav-text-color:rgba(255,255,255,.55); --nav-text-hover:#fff;
  }
  
  body {
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;
    -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  }
  
  .uv-profile-shell { display:flex; min-height:100vh; background:var(--page); color:var(--ink) }
  
  .uv-profile-sidebar {
    width:var(--sidebar-w); flex-shrink:0;
    background:linear-gradient(180deg,var(--sidebar-bg1) 0%,var(--sidebar-bg2) 100%);
    display:flex; flex-direction:column;
    position:sticky; top:0; height:100vh; overflow-y:auto;
    padding:28px 0 24px; z-index:100;
    box-shadow:inset -1px 0 0 rgba(255,255,255,.05);
  }
  
  .uv-profile-logo {
    padding:0 24px 28px; border-bottom:1px solid rgba(255,255,255,.08);
    display:flex; align-items:center; gap:12px;
  }
  
  .uv-profile-logo-mark {
    width:40px; height:40px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(135deg,var(--gold),#f0d87a);
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:18px; color:var(--indigo);
    box-shadow:0 4px 16px rgba(200,168,75,.4);
  }
  
  .uv-profile-logo-name { font-weight:700; font-size:15px; color:#fff; letter-spacing:-.01em }
  .uv-profile-logo-sub { font-size:10px; color:rgba(255,255,255,.45); text-transform:uppercase; margin-top:1px; font-weight:500 }
  
  .uv-profile-nav { padding:20px 16px 8px }
  .uv-profile-nav-label { font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.25); padding:0 8px; margin-bottom:8px; font-weight:700 }
  .uv-profile-nav-item {
    display:flex; align-items:center; gap:11px;
    padding:11px 14px; border-radius:12px;
    color:var(--nav-text-color); font-size:13.5px; font-weight:500;
    cursor:pointer; transition:all .25s; text-decoration:none; margin-bottom:4px;
    position:relative; background:none; border:none; width:100%; text-align:left;
  }
  .uv-profile-nav-item:hover { color:var(--nav-text-hover); background:rgba(255,255,255,.08); transform:translateX(4px) }
  .uv-profile-nav-item.uv-profile-active { color:var(--gold-light); background:rgba(200,168,75,.2); font-weight:600 }
  .uv-profile-spacer { flex:1 }
  
  .uv-profile-main { flex:1; min-width:0; background:var(--page); overflow-y:auto }
  
  .uv-profile-topbar {
    display:flex; align-items:center; gap:16px;
    padding:16px 32px; background:var(--cream);
    border-bottom:1px solid var(--border);
    position:sticky; top:0; z-index:50;
  }
  
  .uv-profile-topbar-title { font-weight:700; font-size:18px; color:var(--ink) }
  .uv-profile-topbar-right { margin-left:auto; display:flex; align-items:center; gap:12px }
  
  .uv-profile-theme-toggle {
    width:40px; height:40px; border-radius:10px; background:transparent;
    border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s; font-size:18px;
  }
  
  .uv-profile-theme-toggle:hover { background:var(--gold-dim) }
  
  .uv-profile-content { padding:32px 40px 32px; max-width:900px; margin:0 auto; width:100% }
  
  .uv-profile-header {
    background:var(--card); border-radius:var(--radius); padding:32px;
    border:1px solid var(--border); box-shadow:var(--shadow);
    margin-bottom:28px; animation:uvCardIn .5s cubic-bezier(.22,.68,0,1.2) both;
  }
  
  .uv-profile-header-content {
    display:flex; align-items:flex-start; gap:24px;
  }
  
  .uv-profile-avatar {
    width:120px; height:120px; border-radius:16px;
    background:linear-gradient(135deg,var(--gold),#f0d87a);
    display:flex; align-items:center; justify-content:center;
    font-size:48px; font-weight:800; color:var(--indigo);
    flex-shrink:0; box-shadow:var(--shadow);
  }
  
  .uv-profile-header-info h1 { font-size:28px; margin-bottom:4px; font-weight:700 }
  .uv-profile-header-role { font-size:14px; color:var(--gold); font-weight:600; letter-spacing:.05em; text-transform:uppercase; margin-bottom:12px }
  .uv-profile-header-email { font-size:14px; color:var(--muted) }
  .uv-profile-header-stats {
    display:flex; gap:20px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border);
  }
  .uv-profile-stat { display:flex; flex-direction:column; gap:4px }
  .uv-profile-stat-label { font-size:12px; color:var(--muted); font-weight:600; text-transform:uppercase }
  .uv-profile-stat-value { font-size:20px; font-weight:700; color:var(--ink) }
  
  .uv-profile-section {
    background:var(--card); border-radius:var(--radius); border:1px solid var(--border);
    box-shadow:var(--shadow); overflow:hidden;
    animation:uvCardIn .5s cubic-bezier(.22,.68,0,1.2) .2s both;
    margin-bottom:28px;
  }
  
  .uv-profile-section-title { font-weight:700; font-size:18px; color:var(--ink); margin-bottom:20px }
  .uv-profile-section-header { padding:16px 20px 14px; border-bottom:1px solid var(--border) }
  
  .uv-profile-form {
    padding:24px;
  }
  
  .uv-profile-form-group {
    margin-bottom:20px;
  }
  
  .uv-profile-form-group:last-child { margin-bottom:0 }
  
  .uv-profile-label {
    display:block; font-weight:600; font-size:14px; color:var(--ink);
    margin-bottom:8px;
  }
  
  .uv-profile-input {
    width:100%; padding:12px 16px; border:1px solid var(--border);
    border-radius:10px; font-size:14px; color:var(--ink);
    background:var(--cream); font-family:inherit;
    transition:all .2s;
  }
  
  .uv-profile-input:focus { outline:none; border-color:var(--gold); background:var(--page); box-shadow:0 0 0 3px var(--gold-dim) }
  
  .uv-profile-input:disabled { background:rgba(10,10,18,.04); color:var(--muted); cursor:not-allowed }
  
  .uv-profile-form-row {
    display:grid; grid-template-columns:1fr 1fr; gap:16px;
  }
  
  .uv-profile-form-row.uv-profile-single {
    grid-template-columns:1fr;
  }
  
  .uv-profile-buttons {
    display:flex; gap:12px; margin-top:24px; justify-content:flex-end;
  }
  
  .uv-profile-btn {
    padding:12px 24px; border-radius:10px; font-size:14px; font-weight:600;
    cursor:pointer; border:none; transition:all .2s;
  }
  
  .uv-profile-btn-primary {
    background:var(--gold); color:var(--indigo);
  }
  
  .uv-profile-btn-primary:hover { background:var(--gold-light); transform:translateY(-2px); box-shadow:var(--shadow-lg) }
  
  .uv-profile-btn-danger {
    background:rgba(232,72,85,.1); color:var(--accent); border:1px solid rgba(232,72,85,.2);
  }
  
  .uv-profile-btn-danger:hover { background:rgba(232,72,85,.15) }
  
  .uv-profile-btn-secondary {
    background:transparent; color:var(--ink); border:1px solid var(--border);
  }
  
  .uv-profile-btn-secondary:hover { background:var(--cream); border-color:var(--gold) }
  
  .uv-profile-alert {
    padding:16px; border-radius:10px; margin-bottom:20px; font-size:14px;
  }
  
  .uv-profile-alert-success { background:rgba(62,207,142,.1); color:var(--accent2); border:1px solid rgba(62,207,142,.2) }
  .uv-profile-alert-danger { background:rgba(232,72,85,.1); color:var(--accent); border:1px solid rgba(232,72,85,.2) }
  
  @keyframes uvCardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
  
  @media(max-width:768px) {
    .uv-profile-sidebar { width:70px }
    .uv-profile-logo-text { display:none }
    .uv-profile-content { padding:16px }
    .uv-profile-form-row { grid-template-columns:1fr }
    .uv-profile-header-content { flex-direction:column; text-align:center }
  }
`;

export const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/admin-login');
      return;
    }
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
    });
  }, [user, navigate]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const root = document.documentElement;
    const style = root.style;
    
    if (newTheme) {
      style.setProperty('--page', '#f5f3ef');
      style.setProperty('--cream', '#faf8f4');
      style.setProperty('--ink', '#0a0a12');
      style.setProperty('--indigo', '#01001d');
      style.setProperty('--sidebar-bg1', '#01001d');
      style.setProperty('--sidebar-bg2', '#05051a');
      style.setProperty('--nav-text-color', 'rgba(255,255,255,.55)');
      style.setProperty('--nav-text-hover', '#fff');
      style.setProperty('--card', '#ffffff');
      style.setProperty('--border', 'rgba(10,10,18,.08)');
      style.setProperty('--muted', '#8a8880');
    } else {
      style.setProperty('--page', '#01001d');
      style.setProperty('--cream', '#05051a');
      style.setProperty('--ink', '#ffffff');
      style.setProperty('--indigo', '#0a0a2e');
      style.setProperty('--sidebar-bg1', '#0a0a2e');
      style.setProperty('--sidebar-bg2', '#05051a');
      style.setProperty('--nav-text-color', 'rgba(200,168,75,.7)');
      style.setProperty('--nav-text-hover', 'var(--gold-light)');
      style.setProperty('--card', '#1a1a3f');
      style.setProperty('--border', 'rgba(255,255,255,.08)');
      style.setProperty('--muted', 'rgba(255,255,255,.6)');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setMessage({ type: '', text: '' });
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error updating profile. Please try again.' });
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const getAvatarInitials = () => {
    return user?.full_name
      ?.split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase() || 'A';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PROFILE_STYLES }} />
      <div className="uv-profile-shell">
        {/* Sidebar */}
        <aside className="uv-profile-sidebar">
          <div className="uv-profile-logo">
            <div className="uv-profile-logo-mark">👤</div>
            <div>
              <div className="uv-profile-logo-name">My Profile</div>
              <div className="uv-profile-logo-sub">Admin</div>
            </div>
          </div>

          <div className="uv-profile-nav">
            <div className="uv-profile-nav-label">Navigation</div>
            <button className="uv-profile-nav-item uv-profile-active">
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button
              className="uv-profile-nav-item"
              onClick={() => navigate(user?.role === 'super_admin' ? '/super-admin' : '/admin')}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>
          </div>

          <div className="uv-profile-spacer" />

          <div className="uv-profile-nav">
            <button className="uv-profile-nav-item" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="uv-profile-main">
          {/* Topbar */}
          <div className="uv-profile-topbar">
            <span className="uv-profile-topbar-title">My Profile</span>
            <div className="uv-profile-topbar-right">
              <button className="uv-profile-theme-toggle" title="Toggle theme" onClick={toggleTheme}>
                {isDark ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          <div className="uv-profile-content">
            {/* Profile Header */}
            <div className="uv-profile-header">
              <div className="uv-profile-header-content">
                <div className="uv-profile-avatar">{getAvatarInitials()}</div>
                <div className="uv-profile-header-info">
                  <h1>{user?.full_name}</h1>
                  <div className="uv-profile-header-role">{user?.role?.replace('_', ' ')}</div>
                  <div className="uv-profile-header-email">{user?.email}</div>
                  <div className="uv-profile-header-stats">
                    <div className="uv-profile-stat">
                      <div className="uv-profile-stat-label">Status</div>
                      <div className="uv-profile-stat-value">{user?.is_active ? '✓ Active' : 'Inactive'}</div>
                    </div>
                    <div className="uv-profile-stat">
                      <div className="uv-profile-stat-label">Member Since</div>
                      <div className="uv-profile-stat-value">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="uv-profile-section">
              <div className="uv-profile-section-header">
                <div className="uv-profile-section-title">Profile Information</div>
              </div>
              <div className="uv-profile-form">
                {message.text && (
                  <div className={`uv-profile-alert uv-profile-alert-${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="uv-profile-form-row">
                  <div className="uv-profile-form-group">
                    <label className="uv-profile-label">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="uv-profile-input"
                    />
                  </div>
                  <div className="uv-profile-form-group">
                    <label className="uv-profile-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="uv-profile-input"
                    />
                  </div>
                </div>

                <div className="uv-profile-form-row uv-profile-single">
                  <div className="uv-profile-form-group">
                    <label className="uv-profile-label">Student ID</label>
                    <input
                      type="text"
                      value={user?.student_id || ''}
                      disabled={true}
                      className="uv-profile-input"
                    />
                  </div>
                </div>

                <div className="uv-profile-buttons">
                  {isEditing ? (
                    <>
                      <button className="uv-profile-btn uv-profile-btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button className="uv-profile-btn uv-profile-btn-primary" onClick={handleSave}>
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button className="uv-profile-btn uv-profile-btn-primary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="uv-profile-section">
              <div className="uv-profile-section-header">
                <div className="uv-profile-section-title">Account Settings</div>
              </div>
              <div className="uv-profile-form">
                <div className="uv-profile-form-group">
                  <label className="uv-profile-label">Role</label>
                  <input
                    type="text"
                    value={user?.role?.replace('_', ' ').toUpperCase() || ''}
                    disabled={true}
                    className="uv-profile-input"
                  />
                </div>
                <div className="uv-profile-form-group">
                  <label className="uv-profile-label">Account Status</label>
                  <input
                    type="text"
                    value={user?.is_active ? 'Active' : 'Inactive'}
                    disabled={true}
                    className="uv-profile-input"
                  />
                </div>
                <div className="uv-profile-buttons">
                  <button className="uv-profile-btn uv-profile-btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MyProfile;

import '../styles/Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Menu</h3>
        <nav className="sidebar-menu">
          <a href="/dashboard" className="menu-item">Dashboard</a>
          <a href="/documents" className="menu-item">My Documents</a>
          <a href="/shared" className="menu-item">Shared with Me</a>
          <a href="/collaborations" className="menu-item">Collaborations</a>
          <a href="/settings" className="menu-item">Settings</a>
        </nav>
      </div>
    </aside>
  );
}

import '../styles/Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <img src="/thuto.png" alt="THUTOSHARE" className="header-logo-image" />
        </div>

        <nav className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <a href="/documents" className="nav-link">Documents</a>
          <a href="/about" className="nav-link">About</a>
        </nav>

        <div className="header-actions">
          <button className="btn-secondary">Profile</button>
          <button className="btn-secondary">Logout</button>
        </div>
      </div>
    </header>
  );
}

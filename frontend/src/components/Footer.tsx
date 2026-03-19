import { useState } from 'react';
import { LegalModal } from './LegalModal';
import '../styles/Footer.css';

type LegalPage = 'privacy' | 'terms' | 'cookies' | 'accessibility' | null;

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPage>(null);

  const handleLegalClick = (page: LegalPage) => {
    setLegalPage(page);
    setLegalModalOpen(true);
  };

  const handleLegalModalClose = () => {
    setLegalModalOpen(false);
    setLegalPage(null);
  };

  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-title">Thuto BAC</div>
            <div className="footer-description">
              Empowering democratic participation through secure and transparent digital voting for Botswana Accountancy College.
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-heading">Quick Links</div>
            <div className="footer-links">
              <div><a href="/">Home</a></div>
              <div><a href="/elections">Current Elections</a></div>
              <div><a href="/login">Login</a></div>
              <div><a href="/admin-login">Admin Login</a></div>
              <div><a href="/">About Thuto BAC</a></div>
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-heading">Features</div>
            <div className="footer-links">
              <div><a href="/">Secure Voting</a></div>
              <div><a href="/">Transparent Results</a></div>
              <div><a href="/">Fast Elections</a></div>
              <div><a href="/">Real-time Updates</a></div>
              <div><a href="/">Voter Verification</a></div>
            </div>
          </div>

          <div className="footer-section">
            <div className="footer-heading">Contact & Hours</div>
            <div className="footer-links">
              <div><strong>Email:</strong> <a href="mailto:ns24-035@thuto.bac.com">ns24-035@thuto.bac.com</a></div>
              <div><strong>Phone:</strong> <a href="tel:+26775751397">+267 7575 1397</a></div>
              <div><strong>Office:</strong> Gaborone, Botswana</div>
              <div><strong>Hours:</strong> Mon - Fri, 08:00 - 17:00 SAST</div>
              <div><a href="/">Technical Support</a></div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-left">
            <div className="footer-credit">
              &copy; {currentYear} ALL RIGHTS RESERVED. CREATED AND MANAGED BY NETWORK SYSTEMS ENGINEERING STUDENT MMOLOKI PHUTHEGO
            </div>
          </div>
          <div className="footer-legal">
            <button onClick={() => handleLegalClick('privacy')} className="footer-legal-button">Privacy Policy</button>
            <button onClick={() => handleLegalClick('terms')} className="footer-legal-button">Terms of Service</button>
            <button onClick={() => handleLegalClick('cookies')} className="footer-legal-button">Cookie Policy</button>
            <button onClick={() => handleLegalClick('accessibility')} className="footer-legal-button">Accessibility</button>
          </div>
        </div>
      </div>

      <LegalModal isOpen={legalModalOpen} onClose={handleLegalModalClose} page={legalPage} />
    </div>
  );
};

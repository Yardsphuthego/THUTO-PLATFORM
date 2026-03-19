import { useState } from 'react';
import '../styles/LegalModal.css';

type LegalPage = 'privacy' | 'terms' | 'cookies' | 'accessibility' | null;

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: LegalPage;
}

export const LegalModal = ({ isOpen, onClose, page }: LegalModalProps) => {
  if (!isOpen || !page) return null;

  const getContent = () => {
    switch (page) {
      case 'privacy':
        return {
          title: 'PRIVACY POLICY',
          content: (
            <>
              <h3>1. Information Collection</h3>
              <p>We collect personal information including your name, student ID, and email address to enable secure voting and election participation.</p>
              
              <h3>2. Data Protection</h3>
              <p>Your data is encrypted and stored securely. We use industry-standard security measures to protect your personal information from unauthorized access.</p>
              
              <h3>3. Data Usage</h3>
              <p>We use your information solely for election management, voter verification, and platform administration. We do not share your data with third parties.</p>
              
              <h3>4. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information. Contact us at ns24-035@thuto.bac.com for any requests.</p>
              
              <h3>5. Changes to Policy</h3>
              <p>We may update this policy periodically. We will notify users of significant changes via email.</p>
            </>
          )
        };
      case 'terms':
        return {
          title: 'TERMS OF SERVICE',
          content: (
            <>
              <h3>1. Acceptance of Terms</h3>
              <p>By using Thuto BAC, you agree to these terms and conditions. If you do not agree, please do not use the platform.</p>
              
              <h3>2. User Responsibilities</h3>
              <p>Users must provide accurate information during registration and maintain confidentiality of login credentials. You are responsible for all activities under your account.</p>
              
              <h3>3. Voting Rules</h3>
              <p>Each registered student is eligible to vote once per election. Duplicate voting attempts will result in account suspension.</p>
              
              <h3>4. Prohibited Activities</h3>
              <p>Users must not attempt to manipulate election results, hack the system, or engage in any fraudulent activities.</p>
              
              <h3>5. Limitation of Liability</h3>
              <p>Thuto BAC is provided "as is". We are not liable for any direct or indirect damages arising from platform use.</p>
            </>
          )
        };
      case 'cookies':
        return {
          title: 'COOKIE POLICY',
          content: (
            <>
              <h3>1. What are Cookies?</h3>
              <p>Cookies are small files stored on your device that help us enhance your experience and remember your preferences.</p>
              
              <h3>2. Types of Cookies We Use</h3>
              <p><strong>Essential Cookies:</strong> Required for login and authentication. <strong>Preference Cookies:</strong> Remember your settings. <strong>Analytics Cookies:</strong> Help us understand platform usage.</p>
              
              <h3>3. Cookie Management</h3>
              <p>You can control cookies through your browser settings. Disabling cookies may affect platform functionality.</p>
              
              <h3>4. Third-Party Cookies</h3>
              <p>We do not use third-party cookies. All cookies are managed directly by Thuto BAC.</p>
              
              <h3>5. Data Retention</h3>
              <p>Cookies are retained for the duration of your session and one year from your last visit.</p>
            </>
          )
        };
      case 'accessibility':
        return {
          title: 'ACCESSIBILITY STATEMENT',
          content: (
            <>
              <h3>1. Commitment to Accessibility</h3>
              <p>Thuto BAC is committed to providing an accessible platform for all users, including those with disabilities.</p>
              
              <h3>2. WCAG Compliance</h3>
              <p>We follow Web Content Accessibility Guidelines (WCAG) 2.1 AA standards to ensure our platform is usable by everyone.</p>
              
              <h3>3. Accessibility Features</h3>
              <p>Our platform includes keyboard navigation, screen reader support, high contrast options, and clear labeling of form fields.</p>
              
              <h3>4. Accessibility Issues</h3>
              <p>If you encounter accessibility barriers, please contact us immediately at ns24-035@thuto.bac.com with details.</p>
              
              <h3>5. Ongoing Improvements</h3>
              <p>We continuously work to improve accessibility and welcome your feedback and suggestions.</p>
            </>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <h2>{title}</h2>
          <button className="legal-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="legal-modal-body">
          {content}
        </div>
        <div className="legal-modal-footer">
          <button className="legal-modal-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

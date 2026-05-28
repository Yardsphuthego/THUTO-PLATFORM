import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconArrow,
  IconDocument,
  IconLock,
  IconShare,
  IconUsers,
} from '../components/Icons';
import Carousel from '../components/Carousel';
import '../styles/Landing.css';

const features = [
  {
    icon: IconDocument,
    number: '01',
    title: 'Collections stay organized',
    description:
      'Present documents, reading packs, internal resources, and library material in one structured view.',
    note: 'Designed for browsing, retrieval, and repeated use.',
  },
  {
    icon: IconShare,
    number: '02',
    title: 'Sharing feels direct',
    description:
      'Move files between staff, students, and project groups with a cleaner workflow and less friction.',
    note: 'Clear access without exposing unnecessary complexity.',
  },
  {
    icon: IconUsers,
    number: '03',
    title: 'Collaboration is built in',
    description:
      'Support quiet study, shared editing, and group work from the same interface without visual clutter.',
    note: 'Made for both individual focus and shared progress.',
  },
  {
    icon: IconLock,
    number: '04',
    title: 'Access remains controlled',
    description:
      'Keep private resources, restricted files, and permissions under control while the experience stays simple.',
    note: 'Security stays present without dominating the design.',
  },
];

const values = [
  {
    icon: IconDocument,
    title: 'Clarity',
    description:
      'Collections, reading paths, and shared resources should feel understandable from the first screen.',
  },
  {
    icon: IconShare,
    title: 'Access',
    description:
      'Knowledge should move easily between staff, students, and learning spaces without unnecessary friction.',
  },
  {
    icon: IconUsers,
    title: 'Collaboration',
    description:
      'The platform should support quiet study, team reading, and active group work with equal care.',
  },
  {
    icon: IconLock,
    title: 'Trust',
    description:
      'Protected content, permissions, and institutional material should remain controlled and dependable.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('user'));

  const openAuth = (mode = 'login') => {
    navigate('/login', {
      state: {
        backgroundLocation: location,
        mode,
      },
    });
  };

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-media">
          <Carousel showContent={false} />
        </div>
      </section>

      <section id="overview" className="landing-overview">
        <div className="landing-overview-shell">
          <div className="landing-overview-intro">
            <div className="landing-overview-heading">
              <h2>A modern home for library collections, reading, and shared work.</h2>
            </div>
          </div>

          <div className="landing-feature-rows">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="landing-feature-row" key={feature.title}>
                  <div className="landing-feature-row-number">{feature.number}</div>

                  <div className="landing-feature-row-main">
                    <div className="landing-feature-icon">
                      <Icon />
                    </div>

                    <div className="landing-feature-row-copy">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>

                  <p className="landing-feature-row-note">{feature.note}</p>
                </article>
              );
            })}
          </div>

          <div id="join" className="landing-overview-cta">
            <div className="landing-overview-cta-copy">
              <h3>Start in one clear, focused workspace.</h3>
              <p>
                Give readers, staff, and teams a direct path into the platform
                without unnecessary friction.
              </p>
            </div>

            <div className="landing-overview-actions">
              <button
                className="landing-cta-primary"
                onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
              >
                {isLoggedIn ? 'Open Dashboard' : 'Get Started'}
                <IconArrow />
              </button>
              <button
                className="landing-cta-secondary"
                onClick={() => openAuth('login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-shell">
          <div className="landing-footer-surface">
            <div className="landing-footer-top">
              <div className="landing-footer-brand">
                <img
                  src="/thuto.png"
                  alt="THUTOSHARE"
                  className="landing-footer-logo"
                />
                <div className="landing-footer-brand-copy">
                  <h3>THUTOSHARE</h3>
                  <p>
                    A focused digital environment for collections, reading,
                    and shared academic work.
                  </p>
                </div>
              </div>

              <button
                className="landing-footer-button"
                onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
              >
                {isLoggedIn ? 'Open Dashboard' : 'Get Started'}
                <IconArrow />
              </button>
            </div>

            <div className="landing-footer-main">
              <section className="landing-footer-mission">
                <span className="landing-footer-label">Mission</span>
                <h4>Build a calmer digital home for collections and shared knowledge.</h4>
                <p>
                  THUTOSHARE helps libraries, reading rooms, and learning teams
                  organize resources, support reading, and manage access through
                  an interface that stays clear, credible, and easy to trust.
                </p>
              </section>

              <section className="landing-footer-values">
                <div className="landing-footer-section-head">
                  <span className="landing-footer-label">Values</span>
                  <p>
                    The platform is shaped around a few principles that keep the
                    experience serious, useful, and dependable.
                  </p>
                </div>

                <div className="landing-footer-values-grid">
                  {values.map((value) => {
                    const Icon = value.icon;

                    return (
                      <article className="landing-footer-value" key={value.title}>
                        <div className="landing-footer-value-icon">
                          <Icon />
                        </div>

                        <div className="landing-footer-value-copy">
                          <h5>{value.title}</h5>
                          <p>{value.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="landing-footer-links">
                <span className="landing-footer-label">Explore</span>
                <a href="#overview">Overview</a>
                <a href="#join">Get Started</a>
                <button
                  className="landing-footer-link-button"
                  onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('login'))}
                >
                  {isLoggedIn ? 'Dashboard' : 'Sign In'}
                </button>
                <p className="landing-footer-links-note">
                  Made for libraries, study rooms, internal knowledge hubs,
                  and protected resource sharing.
                </p>
              </section>
            </div>

            <div className="landing-footer-bottom">
              <span>© 2026 THUTOSHARE</span>
              <span>Mission-led digital access for modern libraries.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

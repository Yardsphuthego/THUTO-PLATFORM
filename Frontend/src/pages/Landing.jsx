import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconArrow,
  IconDocument,
  IconLock,
  IconSearch,
  IconShare,
  IconUsers,
} from '../components/Icons';
import Carousel from '../components/Carousel';
import '../styles/Landing.css';

const heroFields = [
  {
    label: 'Collection',
    value: 'Reading packs & archives',
    icon: IconDocument,
  },
  {
    label: 'Workspace',
    value: 'Rooms and shared study',
    icon: IconUsers,
  },
  {
    label: 'Access',
    value: 'Protected resources',
    icon: IconLock,
  },
  {
    label: 'Flow',
    value: 'Share and collaborate',
    icon: IconShare,
  },
];

const heroBenefits = [
  {
    icon: IconDocument,
    title: 'Curated collections',
    detail: 'Reading packs, archives, and digital material in one place.',
  },
  {
    icon: IconShare,
    title: 'Shared workflow',
    detail: 'Documents move between readers, teams, and staff without friction.',
  },
  {
    icon: IconUsers,
    title: 'Live rooms',
    detail: 'Keep group reading, replies, and discussion close to the work.',
  },
  {
    icon: IconLock,
    title: 'Trusted access',
    detail: 'Private and restricted resources stay controlled and easy to manage.',
  },
];

const showcaseCards = [
  {
    image: '/Library-main-1024x576.png',
    title: 'Reading Rooms',
    meta: 'Quiet study and guided discussion',
    description:
      'Create calmer spaces for annotated reading, room notes, and shared seminar preparation.',
  },
  {
    image: '/Document.jpeg',
    title: 'Digital Collections',
    meta: 'Documents and protected material',
    description:
      'Bring library packs, internal references, and trusted academic resources into one cleaner shelf.',
  },
  {
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
    title: 'Collaboration Spaces',
    meta: 'Shared work and team coordination',
    description:
      'Let readers, staff, and project groups reply, edit, and move together without clutter.',
  },
];

const platformRows = [
  {
    icon: IconDocument,
    title: 'Collections stay easy to browse',
    description:
      'Readers should be able to move from featured material to deeper archives without feeling lost in the interface.',
  },
  {
    icon: IconUsers,
    title: 'Rooms keep discussion visible',
    description:
      'Shared reading, group replies, and guided collaboration stay near the actual documents and notes.',
  },
  {
    icon: IconLock,
    title: 'Access stays calm and controlled',
    description:
      'Permissions, protected shelves, and trusted internal content stay secure without turning the product into an admin wall.',
  },
];

const values = [
  {
    icon: IconDocument,
    title: 'Clarity',
    description:
      'A library homepage should feel understandable from the first glance and stay calm as the system grows.',
  },
  {
    icon: IconShare,
    title: 'Access',
    description:
      'Knowledge should move easily between shelves, readers, and teams without unnecessary friction.',
  },
  {
    icon: IconUsers,
    title: 'Collaboration',
    description:
      'Study, shared editing, room discussion, and collective work should feel naturally connected.',
  },
  {
    icon: IconLock,
    title: 'Trust',
    description:
      'Protected resources and institutional content should stay dependable, controlled, and easy to manage.',
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
        <div className="landing-shell">
          <div className="landing-hero-frame">
            <div className="landing-hero-media">
              <Carousel showContent={false} />
              <div className="landing-hero-shade" />
            </div>

            <div className="landing-hero-content">
              <div className="landing-hero-copy">
                <span className="landing-kicker">THABANG Library</span>
                <h1>
                  Discover.
                  <br />
                  Study.
                  <br />
                  <span>Share knowledge.</span>
                </h1>
                <p>
                  Explore collections, reading rooms, trusted academic
                  resources, and collaborative spaces through one more refined
                  digital library experience.
                </p>
              </div>

              <div className="landing-hero-actions">
                <button
                  className="landing-cta-primary"
                  onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
                >
                  {isLoggedIn ? 'Open Workspace' : 'Get Started'}
                  <IconArrow />
                </button>

                <button
                  className="landing-cta-secondary"
                  onClick={() => openAuth('login')}
                >
                  Sign In
                </button>
              </div>

              <div className="landing-action-band">
                {heroFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div className="landing-action-field" key={field.label}>
                      <div className="landing-action-icon">
                        <Icon />
                      </div>
                      <div className="landing-action-copy">
                        <span>{field.label}</span>
                        <strong>{field.value}</strong>
                      </div>
                    </div>
                  );
                })}

                <button
                  className="landing-action-search"
                  onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
                >
                  <span>Explore</span>
                  <IconSearch />
                </button>
              </div>

              <div className="landing-hero-benefits">
                {heroBenefits.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article className="landing-hero-benefit" key={item.title}>
                      <div className="landing-hero-benefit-icon">
                        <Icon />
                      </div>
                      <div className="landing-hero-benefit-copy">
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="landing-showcase">
        <div className="landing-shell">
          <div className="landing-showcase-board">
            <div className="landing-showcase-grid">
              <div className="landing-showcase-intro">
                <span className="landing-section-label">Explore The Library</span>
                <div>
                  <h2>Popular spaces for reading, collections, and shared study.</h2>
                  <p>
                    Give visitors a stronger first impression with real spaces they
                    can imagine using right away.
                  </p>
                </div>
                <button
                  className="landing-outline-button"
                  onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
                >
                  View the platform
                  <IconArrow />
                </button>
              </div>

              {showcaseCards.map((card) => (
                <article className="landing-showcase-card" key={card.title}>
                  <img src={card.image} alt={card.title} />
                  <div className="landing-showcase-card-copy">
                    <span>{card.meta}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="landing-platform-strip">
              {platformRows.map((row) => {
                const Icon = row.icon;

                return (
                  <article className="landing-platform-row" key={row.title}>
                    <div className="landing-platform-row-icon">
                      <Icon />
                    </div>
                    <div className="landing-platform-row-copy">
                      <h3>{row.title}</h3>
                      <p>{row.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer id="join" className="landing-footer">
        <div className="landing-shell">
          <div className="landing-footer-panel">
            <div className="landing-footer-top">
              <div className="landing-footer-brand">
                <div className="landing-footer-logo-wrap">
                  <img src="/thuto.png" alt="THABANG Library" className="landing-footer-logo" />
                </div>
                <div className="landing-footer-brand-copy">
                  <span className="landing-section-label">THABANG Library</span>
                  <h3>A focused digital home for collections, reading, and trusted collaboration.</h3>
                </div>
              </div>

              <div className="landing-footer-actions">
                <button
                  className="landing-cta-primary"
                  onClick={() => (isLoggedIn ? navigate('/dashboard') : openAuth('signup'))}
                >
                  {isLoggedIn ? 'Open Workspace' : 'Get Started'}
                  <IconArrow />
                </button>
              </div>
            </div>

            <div className="landing-footer-main">
              <section className="landing-footer-mission">
                <span className="landing-section-label">Mission</span>
                <p>
                  Build a modern library experience where collections,
                  discussion rooms, shared documents, and protected resources
                  feel organized from the first screen.
                </p>
              </section>

              <section className="landing-footer-values">
                <span className="landing-section-label">Values</span>
                <div className="landing-footer-values-grid">
                  {values.map((value) => {
                    const Icon = value.icon;

                    return (
                      <article className="landing-footer-value" key={value.title}>
                        <div className="landing-footer-value-icon">
                          <Icon />
                        </div>
                        <div className="landing-footer-value-copy">
                          <h4>{value.title}</h4>
                          <p>{value.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="landing-footer-bottom">
              <span>© 2026 THABANG Library</span>
              <span>Digital collections, trusted access, and connected learning spaces.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

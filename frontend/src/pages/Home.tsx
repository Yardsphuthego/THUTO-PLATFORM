import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Megaphone,
  ShieldCheck,
  Trophy,
  Users,
  Vote,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal, type AuthModalKind } from '../components/AuthPanels';
import { campusCarouselSlides } from '../data/carouselSlides';
import '../styles/Home.css';

type Tone = 'blue' | 'green' | 'slate' | 'dark';

type HeroMetric = {
  icon: LucideIcon;
  value: string;
  label: string;
};

type AnalyticsCard = {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
  trend: string;
  chart: number[];
  tone: Tone;
};

type ProgrammeHighlight = {
  rank: number;
  badge: string;
  title: string;
  meta: string;
  campus: string;
  detail: string;
  tone: Tone;
};

type FacultyMetric = {
  icon: LucideIcon;
  name: string;
  voters: string;
  pct: number;
  tone: Tone;
};

type ActivityItem = {
  icon: LucideIcon;
  title: string;
  date: string;
  tone: Tone;
};

type SchoolCard = {
  icon: LucideIcon;
  code: string;
  name: string;
  elections: number;
  cycle: string;
  focus: string;
  campus: string;
};

type NewsItem = {
  icon: LucideIcon;
  title: string;
  meta: string;
  tone: Tone;
};

const heroMetrics: HeroMetric[] = [
  { icon: Building2, value: '3', label: 'universities' },
  { icon: Vote, value: '4', label: 'live elections' },
  { icon: Users, value: '2,340', label: 'verified students' },
];

const analyticsCards: AnalyticsCard[] = [
  {
    icon: Building2,
    value: '3',
    label: 'Onboarded universities',
    detail: 'BAC, BUST, and UB are configured in one super admin workspace.',
    trend: 'Institutions',
    chart: [1, 1, 1, 2, 2, 3, 3, 3, 3],
    tone: 'blue',
  },
  {
    icon: Vote,
    value: '4',
    label: 'Live elections',
    detail: 'Election windows are scheduled per university with role-level ballot controls.',
    trend: 'Live ballots',
    chart: [0, 1, 1, 2, 2, 3, 3, 4, 4],
    tone: 'green',
  },
  {
    icon: Users,
    value: '26',
    label: 'Candidate profiles',
    detail: 'Each candidate entry includes photo, party logo, position, and manifesto.',
    trend: 'Candidate board',
    chart: [5, 7, 9, 12, 15, 18, 21, 24, 26],
    tone: 'slate',
  },
  {
    icon: ShieldCheck,
    value: '2,340',
    label: 'Verified voters',
    detail: 'Role-based login keeps super admin, university admin, and student access separated.',
    trend: 'Voter roll',
    chart: [620, 840, 1010, 1240, 1460, 1710, 1940, 2170, 2340],
    tone: 'dark',
  },
];

const programmeHighlights: ProgrammeHighlight[] = [
  {
    rank: 1,
    badge: 'SRC',
    title: 'SRC General Election',
    meta: 'Botswana Accountancy College',
    campus: 'Status: Live now',
    detail: '8 positions · 12 candidates',
    tone: 'blue',
  },
  {
    rank: 2,
    badge: 'FCL',
    title: 'Faculty Council Election',
    meta: 'Botswana University of Science and Technology',
    campus: 'Status: Opening soon',
    detail: '5 positions · 8 candidates',
    tone: 'green',
  },
  {
    rank: 3,
    badge: 'SWC',
    title: 'Student Welfare Council',
    meta: 'University of Botswana',
    campus: 'Status: Nomination review',
    detail: '4 positions · 6 candidates',
    tone: 'slate',
  },
];

const facultyMetrics: FacultyMetric[] = [
  {
    icon: Building2,
    name: 'Botswana Accountancy College',
    voters: '1,220 verified students',
    pct: 52,
    tone: 'blue',
  },
  {
    icon: LayoutDashboard,
    name: 'Botswana University of Science and Technology',
    voters: '730 verified students',
    pct: 31,
    tone: 'green',
  },
  {
    icon: GraduationCap,
    name: 'University of Botswana',
    voters: '390 verified students',
    pct: 17,
    tone: 'slate',
  },
];

const activityItems: ActivityItem[] = [
  {
    icon: ShieldCheck,
    title: 'University admins are scoped to the university assigned by super admin.',
    date: 'Role scope',
    tone: 'blue',
  },
  {
    icon: Vote,
    title: 'Candidate setup requires photo, party logo, position, and manifesto.',
    date: 'Candidate quality',
    tone: 'green',
  },
  {
    icon: Users,
    title: 'Students vote once per election with full party and role visibility.',
    date: 'Voting rule',
    tone: 'slate',
  },
  {
    icon: Bell,
    title: 'Every authentication and election action is captured in activity logs.',
    date: 'Audit trail',
    tone: 'dark',
  },
];

const schools: SchoolCard[] = [
  {
    icon: Building2,
    code: 'BAC',
    name: 'Botswana Accountancy College',
    elections: 2,
    cycle: 'Cycle: Jul-Dec 2026',
    focus: 'SRC and faculty leadership ballots',
    campus: 'Gaborone',
  },
  {
    icon: LayoutDashboard,
    code: 'BUST',
    name: 'Botswana University of Science and Technology',
    elections: 1,
    cycle: 'Cycle: Jul-Dec 2026',
    focus: 'Faculty councils and society representation',
    campus: 'Palapye',
  },
  {
    icon: GraduationCap,
    code: 'UB',
    name: 'University of Botswana',
    elections: 1,
    cycle: 'Cycle: Jul-Dec 2026',
    focus: 'Welfare and student services ballot',
    campus: 'Gaborone',
  },
];

const newsItems: NewsItem[] = [
  {
    icon: CalendarDays,
    title: 'Nomination deadline: April 5, 2026',
    meta: 'All universities · Deadline notice',
    tone: 'blue',
  },
  {
    icon: Vote,
    title: 'Voting opens: April 14, 2026',
    meta: 'Election office · Official schedule',
    tone: 'green',
  },
  {
    icon: Trophy,
    title: 'Result publication: April 18, 2026',
    meta: 'Election office · Verified tally',
    tone: 'blue',
  },
  {
    icon: Bell,
    title: 'Scoped admin creation is enforced by university ownership',
    meta: 'Security policy · Active',
    tone: 'dark',
  },
];

const toneStyles: Record<Tone, { color: string; background: string }> = {
  blue: { color: '#111111', background: '#f2f2f4' },
  green: { color: '#1f1f1f', background: '#ececef' },
  slate: { color: '#3a3a3c', background: '#e8e8eb' },
  dark: { color: '#000000', background: '#e2e2e6' },
};

function LineSparkline({ data, tone }: { data: number[]; tone: Tone }): JSX.Element {
  const { color } = toneStyles[tone];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 36 - ((value - min) / range) * 30;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <div className="home-dashboard__line-chart" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        <polyline className="home-dashboard__line-chart-track" points="0,36 100,36" />
        <polyline
          className="home-dashboard__line-chart-path"
          points={points}
          style={{ stroke: color }}
        />
      </svg>
    </div>
  );
}

type HomeProps = {
  initialAuthModal?: AuthModalKind | null;
};

export function Home({ initialAuthModal = null }: HomeProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [authModalKind, setAuthModalKind] = useState<AuthModalKind | null>(initialAuthModal);

  const isSignedIn = Boolean(user) || isAuthenticated;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const firstName = user?.full_name?.split(' ')[0] || 'Student';
  const primaryRoute =
    user?.role === 'super_admin'
      ? '/super-admin'
      : user?.role === 'admin'
        ? '/admin'
        : '/elections';
  const primaryLabel = isAdmin ? 'Open dashboard' : 'Go to elections';
  const slideCount = campusCarouselSlides.length;
  const currentSlide = campusCarouselSlides[activeSlide] ?? campusCarouselSlides[0];
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/admin-login';
  const authReason = new URLSearchParams(location.search).get('reason');
  const authNotice =
    authReason === 'session-expired' ? 'Your session expired. Please sign in again.' : '';

  useEffect(() => {
    if (initialAuthModal) {
      setAuthModalKind(initialAuthModal);
    }
  }, [initialAuthModal]);

  useEffect(() => {
    if (slideCount <= 1) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 5000);

    return () => window.clearInterval(id);
  }, [slideCount]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openStudentLogin = () => {
    setAuthModalKind('student');
  };

  const closeAuthModal = () => {
    setAuthModalKind(null);

    if (isAuthRoute) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="home-dashboard">
      <header className="home-dashboard__nav">
        <div className="home-dashboard__nav-inner">
          <button type="button" className="home-dashboard__brand" onClick={() => navigate('/')}>
            <span className="home-dashboard__brand-mark">
              <Vote size={18} />
            </span>
            <span className="home-dashboard__brand-copy">
              <span className="home-dashboard__brand-name">THUTO Voting</span>
              <span className="home-dashboard__brand-subtitle">BAC Student Elections 2026</span>
            </span>
          </button>

          <nav className="home-dashboard__nav-links" aria-label="Landing sections">
            <a href="#overview">Overview</a>
            <a href="#elections">Elections</a>
            <a href="#universities">Universities</a>
          </nav>

          <div className="home-dashboard__nav-actions">
            {isSignedIn ? (
              <>
                <span className="home-dashboard__session-pill">
                  {user ? `${firstName} signed in` : 'Session active'}
                </span>
                {user && (
                  <button
                    type="button"
                    className="home-dashboard__button home-dashboard__button--secondary"
                    onClick={() => navigate('/my-profile')}
                  >
                    My profile
                  </button>
                )}
                <button
                  type="button"
                  className="home-dashboard__button home-dashboard__button--primary"
                  onClick={() => navigate(primaryRoute)}
                >
                  {primaryLabel}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="home-dashboard__button home-dashboard__button--secondary"
                  onClick={openStudentLogin}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="home-dashboard__main">
        <section className="home-dashboard__hero">
          <div className="home-dashboard__carousel">
            <div
              className="home-dashboard__carousel-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {campusCarouselSlides.map((slide, index) => (
                <article key={`${slide.image}-${index}`} className="home-dashboard__carousel-slide">
                  <img
                    className="home-dashboard__carousel-image"
                    src={slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </article>
              ))}
            </div>
            <div className="home-dashboard__carousel-overlay" />
            <div className="home-dashboard__carousel-content">
              <div className="home-dashboard__hero-copy">
                <h1 className="home-dashboard__hero-title">{currentSlide.title}</h1>
                <p className="home-dashboard__hero-description">{currentSlide.description}</p>
                <p className="home-dashboard__hero-subline">
                  {isSignedIn
                    ? `Welcome back, ${firstName}. Review elections, candidate slates, and move into your portal from here.`
                    : 'Review live election operations, then continue with secure sign in.'}
                </p>

                <div className="home-dashboard__hero-actions">
                  {isSignedIn ? (
                    <>
                      <button
                        type="button"
                        className="home-dashboard__button home-dashboard__button--primary"
                        onClick={() => navigate(primaryRoute)}
                      >
                        {primaryLabel}
                        <ArrowRight size={16} />
                      </button>
                      {user && (
                        <button
                          type="button"
                          className="home-dashboard__button home-dashboard__button--secondary home-dashboard__button--light"
                          onClick={() => navigate('/my-profile')}
                        >
                          View profile
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="home-dashboard__button home-dashboard__button--primary"
                        onClick={openStudentLogin}
                      >
                        Sign in
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="home-dashboard__hero-metrics">
                {heroMetrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div key={metric.label} className="home-dashboard__hero-metric">
                      <div className="home-dashboard__hero-metric-icon">
                        <Icon size={18} />
                      </div>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        <section id="overview" className="home-dashboard__section">
          <div className="home-dashboard__section-intro">
            <span className="home-dashboard__section-tag">THUTO 2026</span>
            <h2>THUTO BAC Online Voting System.</h2>
            <p>
              A secure digital election platform for Botswana Accountancy College and partner universities,
              built for transparent student governance and role-based control.
            </p>
          </div>

          <div className="home-dashboard__summary-grid">
            {analyticsCards.map((card) => {
              const Icon = card.icon;
              const tone = toneStyles[card.tone];

              return (
                <article key={card.label} className="home-dashboard__summary-row">
                  <div className="home-dashboard__summary-top">
                    <div className="home-dashboard__summary-icon" style={{ color: tone.color, background: tone.background }}>
                      <Icon size={20} />
                    </div>
                    <span className="home-dashboard__summary-trend" style={{ color: tone.color, background: tone.background }}>
                      {card.trend}
                    </span>
                  </div>
                  <div className="home-dashboard__summary-value">{card.value}</div>
                  <div className="home-dashboard__summary-label">{card.label}</div>
                  <LineSparkline data={card.chart} tone={card.tone} />
                  <p className="home-dashboard__summary-detail">{card.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="elections" className="home-dashboard__section">
          <div className="home-dashboard__section-intro">
            <span className="home-dashboard__section-tag">Live elections</span>
            <h2>Current ballots and governance controls.</h2>
            <p>
              These are the core operational views for the current cycle: active ballots, voter coverage,
              and platform rules enforced by the backend logic.
            </p>
          </div>

          <div className="home-dashboard__grid home-dashboard__grid--primary">
            <article className="home-dashboard__block">
                <div className="home-dashboard__panel-header">
                  <div className="home-dashboard__panel-title">
                    <Trophy size={18} />
                    <span>Active elections</span>
                  </div>
                  <span className="home-dashboard__panel-chip">4 ballots</span>
                </div>

              <div className="home-dashboard__candidate-list">
                {programmeHighlights.map((programme) => {
                  const tone = toneStyles[programme.tone];

                  return (
                    <div key={programme.title} className="home-dashboard__candidate-item">
                      <div className="home-dashboard__candidate-rank">{programme.rank}</div>
                      <div className="home-dashboard__candidate-avatar" style={{ background: tone.background, color: tone.color }}>
                        {programme.badge}
                      </div>
                      <div className="home-dashboard__candidate-copy">
                        <strong>{programme.title}</strong>
                        <span>{programme.meta}</span>
                      </div>
                      <div className="home-dashboard__candidate-votes">
                        <strong>{programme.campus}</strong>
                        <span>{programme.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <div className="home-dashboard__stack">
              <article className="home-dashboard__block">
                <div className="home-dashboard__panel-header">
                  <div className="home-dashboard__panel-title">
                    <BarChart3 size={18} />
                    <span>University coverage</span>
                  </div>
                  <span className="home-dashboard__panel-chip">Voter distribution</span>
                </div>

                <div className="home-dashboard__faculty-list">
                  {facultyMetrics.map((faculty) => {
                    const Icon = faculty.icon;
                    const tone = toneStyles[faculty.tone];

                    return (
                      <div key={faculty.name} className="home-dashboard__faculty-item">
                        <div className="home-dashboard__faculty-main">
                          <div className="home-dashboard__faculty-icon" style={{ color: tone.color, background: tone.background }}>
                            <Icon size={18} />
                          </div>
                          <div className="home-dashboard__faculty-copy">
                            <strong>{faculty.name}</strong>
                            <span>{faculty.voters}</span>
                          </div>
                          <div className="home-dashboard__faculty-pct">{faculty.pct}%</div>
                        </div>
                        <div className="home-dashboard__faculty-track">
                          <span
                            className="home-dashboard__faculty-fill"
                            style={{ width: `${faculty.pct}%`, background: tone.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="home-dashboard__block">
                <div className="home-dashboard__panel-header">
                  <div className="home-dashboard__panel-title">
                    <Bell size={18} />
                    <span>Governance rules</span>
                  </div>
                  <span className="home-dashboard__panel-chip">Core logic</span>
                </div>

                <div className="home-dashboard__activity-list">
                  {activityItems.map((item) => {
                    const Icon = item.icon;
                    const tone = toneStyles[item.tone];

                    return (
                      <div key={`${item.title}-${item.date}`} className="home-dashboard__activity-item">
                        <div className="home-dashboard__activity-icon" style={{ color: tone.color, background: tone.background }}>
                          <Icon size={18} />
                        </div>
                        <div className="home-dashboard__activity-copy">
                          <strong>{item.title}</strong>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="universities" className="home-dashboard__section home-dashboard__section--last">
          <div className="home-dashboard__section-intro">
            <span className="home-dashboard__section-tag">Universities and notices</span>
            <h2>Institution setup and election-cycle updates.</h2>
            <p>
              Super admins can review each university scope and keep the election office timeline visible
              from a single landing view.
            </p>
          </div>

          <div className="home-dashboard__grid home-dashboard__grid--secondary">
            <article className="home-dashboard__block">
              <div className="home-dashboard__panel-header">
                <div className="home-dashboard__panel-title">
                  <Building2 size={18} />
                  <span>Managed universities</span>
                </div>
                <span className="home-dashboard__panel-chip">{schools.length} universities</span>
              </div>

              <div className="home-dashboard__school-grid">
                {schools.map((school) => {
                  const Icon = school.icon;

                  return (
                    <div key={school.code} className="home-dashboard__school-row">
                      <div className="home-dashboard__school-top">
                        <div className="home-dashboard__school-icon">
                          <Icon size={18} />
                        </div>
                        <span className="home-dashboard__school-code">{school.code}</span>
                      </div>
                      <strong>{school.name}</strong>
                      <div className="home-dashboard__school-meta">
                        <span>
                          <Vote size={14} />
                          {school.elections} active elections
                        </span>
                        <span>
                          <CalendarDays size={14} />
                          {school.cycle}
                        </span>
                        <span>
                          <MapPin size={14} />
                          {school.campus}
                        </span>
                        <span>
                          <Megaphone size={14} />
                          {school.focus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="home-dashboard__block">
              <div className="home-dashboard__panel-header">
                <div className="home-dashboard__panel-title">
                  <Megaphone size={18} />
                  <span>Platform updates</span>
                </div>
                <span className="home-dashboard__panel-chip">Live notices</span>
              </div>

              <div className="home-dashboard__news-list">
                {newsItems.map((news) => {
                  const Icon = news.icon;
                  const tone = toneStyles[news.tone];

                  return (
                    <div key={news.title} className="home-dashboard__news-item">
                      <div className="home-dashboard__news-icon" style={{ color: tone.color, background: tone.background }}>
                        <Icon size={18} />
                      </div>
                      <div className="home-dashboard__news-copy">
                        <strong>{news.title}</strong>
                        <span>{news.meta}</span>
                      </div>
                      <ChevronRight size={18} className="home-dashboard__news-arrow" />
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="home-dashboard__footer">
        <div className="home-dashboard__footer-inner">
          <div className="home-dashboard__footer-copy">
            <strong>THUTO BAC Online Voting System 2026</strong>
            <span>Secure, transparent, and scoped student elections for every university onboarded.</span>
          </div>

          <div className="home-dashboard__footer-actions">
            <a href="#overview">Overview</a>
            <a href="#elections">Elections</a>
            <a href="#universities">Universities</a>
            {isSignedIn ? (
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <button type="button" onClick={openStudentLogin}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </footer>

      {authModalKind && !isSignedIn && (
        <AuthModal
          kind={authModalKind}
          onClose={closeAuthModal}
          notice={authNotice}
        />
      )}
    </div>
  );
}

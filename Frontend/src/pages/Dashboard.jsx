import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconDocument, IconSearch, IconUsers } from '../components/Icons';
import { createDraftDocument, loadDocuments, saveDocuments, slugifyRoomName } from '../lib/mockLibraryData';
import '../styles/Dashboard.css';

const userFeedPosts = [
  {
    author: 'Library Services',
    role: 'Campus Library',
    room: 'Humanities Reading Room',
    time: '8 min ago',
    type: 'Reading Pack',
    title: 'New annotated readings are live for this week’s seminar',
    body:
      'The latest pack now includes margin notes, a discussion guide, and one new archive extract for Friday’s room conversation.',
    tags: ['English 301', 'Discussion Guide'],
    engagement: '26 readers opened this update',
    docId: 1,
    image: '/Library-main-1024x576.png',
  },
  {
    author: 'Dr. Mpho Dintwe',
    role: 'Research Supervisor',
    room: 'Research Support Hub',
    time: '1 hr ago',
    type: 'Feedback',
    title: 'Your methodology outline has new supervisor feedback',
    body:
      'Two sections were highlighted for revision, and your project room has a fresh thread asking the team to respond before tomorrow.',
    tags: ['Supervisor Note', 'Research'],
    engagement: '3 replies are waiting for you',
    docId: 2,
    image: '/Document.jpeg',
  },
  {
    author: 'Kagiso Molefe',
    role: 'Classmate',
    room: 'Archive Requests Board',
    time: 'Today',
    type: 'Room Update',
    title: 'Archive visit slots were opened for the preservation collection',
    body:
      'Three new access windows are available this week, and the room pinned a short note on what to prepare before the visit.',
    tags: ['Archive Visit', 'Controlled Access'],
    engagement: '14 room members saved the update',
    docId: 4,
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
  },
];

const userSpaces = [
  {
    title: 'Humanities Reading Room',
    meta: '48 readers',
    description: 'Weekly reading lists, room notes, and group discussions for literature students.',
    activity: '9 new notes today',
    image: '/Library-main-1024x576.png',
  },
  {
    title: 'Research Support Hub',
    meta: '12 collaborators',
    description: 'A guided space for citations, supervisor feedback, and project support.',
    activity: '3 replies waiting',
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
  },
  {
    title: 'Archive Requests Board',
    meta: '8 active requests',
    description: 'Track reserved material, controlled access, and internal archive conversations.',
    activity: '2 approvals today',
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
  },
];

const userDiscoveries = [
  {
    title: 'Public Policy Reading Circle',
    meta: '22 readers',
    detail: 'A slower weekly room focused on discussion notes and curated readings.',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
  },
  {
    title: 'Digital Scholarship Lab',
    meta: '9 active collaborators',
    detail: 'Shared project threads, references, and annotated working papers.',
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
  },
  {
    title: 'Community Reading Programme',
    meta: 'Open for volunteers',
    detail: 'A lighter public-facing room built around reading support and outreach.',
    image: '/Library-main-1024x576.png',
  },
];

const userUpcoming = [
  {
    title: 'Literature seminar discussion',
    meta: 'Today · 14:00',
    detail: 'Reading room conversation starts at 14:00 with the new annotated pack.',
    image: '/Library-main-1024x576.png',
    room: 'Humanities Reading Room',
  },
  {
    title: 'Methodology feedback window',
    meta: 'Tomorrow · 09:00',
    detail: 'Supervisor comments should be addressed before tomorrow morning.',
    image: '/Document.jpeg',
    room: 'Research Support Hub',
  },
  {
    title: 'Archive access slot',
    meta: 'Friday · 11:30',
    detail: 'Preservation materials are reserved for you on Friday.',
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
    room: 'Archive Requests Board',
  },
];

const userPulse = [
  { label: 'Most saved topic', value: 'Archive access notes', image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg', room: 'Archive Requests Board' },
  { label: 'Fastest growing room', value: 'Research Support Hub', image: '/vacant-modern-workspace-with-computers_482257-127194.avif', room: 'Research Support Hub' },
  { label: 'Pinned this week', value: 'African Literature Reading Pack', image: '/Library-main-1024x576.png', room: 'Humanities Reading Room' },
];

const userMetricBars = [42, 68, 37, 81, 56, 92, 48, 74];
const userRoomPulseBars = [26, 66, 24, 74, 45, 92, 38];
const userReadingPoints = [0.28, 0.42, 0.34, 0.58, 0.5, 0.72, 0.46, 0.61, 0.49, 0.76];

const adminMetricBars = [18, 24, 11, 44, 14, 36, 58, 8, 18];
const adminReviewerBars = [26, 58, 14, 66, 22, 82, 18];
const adminThroughputBars = [62, 44, 78, 38, 84, 48, 72, 58, 88];
const adminResponsePoints = [0.45, 0.3, 0.72, 0.4, 0.78, 0.36, 0.6, 0.42, 0.86, 0.5];
const adminScatterPoints = [
  { x: 6, y: 72 },
  { x: 14, y: 18 },
  { x: 21, y: 26 },
  { x: 31, y: 58 },
  { x: 41, y: 82 },
  { x: 53, y: 34 },
  { x: 67, y: 12 },
  { x: 78, y: 65 },
  { x: 88, y: 44 },
  { x: 95, y: 10 },
];

const adminCollections = [
  {
    name: 'Botswana History Archive',
    usage: '2,814 visits',
    state: 'Healthy',
    note: 'Metadata refresh completed this morning.',
    image: '/Library-main-1024x576.png',
  },
  {
    name: 'Faculty Research Repository',
    usage: '1,126 visits',
    state: 'Review',
    note: 'Needs access policy sign-off before wider release.',
    image: '/Document.jpeg',
  },
  {
    name: 'Digitised Newspapers Collection',
    usage: '3,441 visits',
    state: 'Growing',
    note: 'High engagement from reading rooms and external scholars.',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
  },
];

const accessRequests = [
  {
    name: 'Faculty of Education',
    request: 'Contributor access for 6 lecturers',
    priority: 'High',
    note: 'Requested for curriculum revision week.',
    image: '/Document.jpeg',
  },
  {
    name: 'Archive Preservation Team',
    request: 'Restricted-room access review',
    priority: 'Medium',
    note: 'Requires policy approval from records management.',
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
  },
  {
    name: 'Public Reading Programme',
    request: 'View-only access for volunteer readers',
    priority: 'Low',
    note: 'Suitable for the new community reading pilot.',
    image: '/Library-main-1024x576.png',
  },
];

const governanceItems = [
  {
    title: 'Permission model review',
    detail: 'Five role changes are ready for approval.',
    image: '/Document.jpeg',
  },
  {
    title: 'Collection quality checks',
    detail: 'Cataloguing audit is scheduled for tomorrow morning.',
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
  },
  {
    title: 'Space moderation',
    detail: 'Two shared rooms need policy reminders for pinned material.',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
  },
];

const adminSections = [
  {
    title: 'Favorites',
    items: [
      { label: 'Overview dashboard' },
      { label: 'Collection health' },
      { label: 'Response metrics' },
    ],
  },
  {
    title: 'Prebuilt Dashboards',
    items: [
      { label: 'Review collaboration', active: true },
      { label: 'Developer summary' },
      { label: 'Library metric grid' },
      { label: 'Governance workload' },
      { label: 'Protected access' },
    ],
  },
];

const userSections = [
  {
    title: 'Favorites',
    items: [
      { label: 'Home feed', active: true },
      { label: 'Reading shelf' },
      { label: 'Room pulse' },
    ],
  },
  {
    title: 'Shared Spaces',
    items: [
      { label: 'Humanities Reading Room' },
      { label: 'Research Support Hub' },
      { label: 'Archive Requests Board' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { label: 'Saved reading packs' },
      { label: 'Protected resources' },
      { label: 'Shared notes' },
    ],
  },
];

function IconGridMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconTrendMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 17l5-5 4 4 7-8" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

function IconCalendarMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function IconBellMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 17h8l-1-1.6V11a3 3 0 1 0-6 0v4.4L8 17z" />
      <path d="M10.5 19a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

function IconSunMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function IconMoonMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.4A8 8 0 0 1 9.6 4 8.4 8.4 0 1 0 20 14.4z" />
    </svg>
  );
}

function IconShieldMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4l7 3v5c0 4.2-2.8 7.4-7 8-4.2-.6-7-3.8-7-8V7l7-3z" />
    </svg>
  );
}

function IconPlusMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconBookmarkMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10v16l-5-3-5 3z" />
    </svg>
  );
}

function IconMenuMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

function IconChevronMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function IconDotsMini() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

function IconBubbleMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function getInitials(name) {
  return (name || 'User')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function createAvatarDataUri(name, role) {
  const initials = getInitials(name);
  const gradientTop = role === 'super-admin' ? '#1d4ed8' : '#0b1f4a';
  const gradientBottom = role === 'super-admin' ? '#4f46e5' : '#2563eb';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientTop}" />
          <stop offset="100%" stop-color="${gradientBottom}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="46" fill="url(#avatarGradient)" />
      <circle cx="80" cy="60" r="28" fill="rgba(255,255,255,0.18)" />
      <path d="M38 132c8-22 24-34 42-34s34 12 42 34" fill="rgba(255,255,255,0.18)" />
      <text x="80" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function menuIconForLabel(label) {
  const normalized = label.toLowerCase();

  if (normalized.includes('home') || normalized.includes('overview')) return IconGridMini;
  if (normalized.includes('room') || normalized.includes('space')) return IconUsers;
  if (
    normalized.includes('collection') ||
    normalized.includes('pack') ||
    normalized.includes('resource') ||
    normalized.includes('document') ||
    normalized.includes('shelf') ||
    normalized.includes('note')
  ) {
    return IconDocument;
  }
  if (
    normalized.includes('metric') ||
    normalized.includes('response') ||
    normalized.includes('review') ||
    normalized.includes('throughput') ||
    normalized.includes('pulse') ||
    normalized.includes('summary')
  ) {
    return IconTrendMini;
  }
  if (
    normalized.includes('protected') ||
    normalized.includes('approval') ||
    normalized.includes('governance')
  ) {
    return IconShieldMini;
  }

  return IconBubbleMini;
}

function navKeyForLabel(label, role) {
  const normalized = label.toLowerCase();

  if (role === 'super-admin') {
    if (normalized.includes('collection')) return 'collections';
    if (normalized.includes('approval') || normalized.includes('protected')) return 'approvals';
    if (normalized.includes('governance')) return 'governance';
    return 'overview';
  }

  if (normalized.includes('room') || normalized.includes('space')) return 'rooms';
  if (normalized.includes('collection') || normalized.includes('pack') || normalized.includes('reading')) return 'reading';
  if (normalized.includes('pulse') || normalized.includes('protected')) return 'pulse';
  return 'home';
}

function DashboardPanel({ className = '', id, children }) {
  return (
    <section id={id} className={`dashboard-panel ${className}`}>
      {children}
    </section>
  );
}

function PanelTopline({ title, subtitle }) {
  return (
    <div className="dashboard-panel-topline">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <button type="button" className="dashboard-icon-button" aria-label="More options">
        <IconDotsMini />
      </button>
    </div>
  );
}

function DonutMetricCard({ title, value, detail, progress }) {
  const angle = Math.max(8, Math.min(360, (progress / 100) * 360));

  return (
    <DashboardPanel className="dashboard-metric-card">
      <PanelTopline title={title} />
      <div className="dashboard-metric-card-body">
        <div
          className="dashboard-donut"
          style={{ background: `conic-gradient(var(--dashboard-accent) ${angle}deg, rgba(255,255,255,0.08) 0deg)` }}
        >
          <div className="dashboard-donut-hole" />
        </div>

        <div className="dashboard-metric-copy">
          <strong>{value}</strong>
          <span>{detail}</span>
        </div>
      </div>
    </DashboardPanel>
  );
}

function Sparkline({ points }) {
  const width = 240;
  const height = 76;
  const step = width / (points.length - 1);
  const coordinates = points
    .map((point, index) => `${index * step},${height - point * (height - 16) - 8}`)
    .join(' ');
  const area = `0,${height} ${coordinates} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="dashboard-sparkline" aria-hidden="true">
      <polygon points={area} className="dashboard-sparkline-area" />
      <polyline points={coordinates} className="dashboard-sparkline-line" />
    </svg>
  );
}

function SparkMetricCard({ title, value, delta, points }) {
  return (
    <DashboardPanel className="dashboard-metric-card">
      <PanelTopline title={title} />
      <div className="dashboard-metric-split">
        <div className="dashboard-metric-copy dashboard-metric-copy--stacked">
          <strong>{value}</strong>
          <span className="dashboard-delta dashboard-delta--positive">{delta}</span>
        </div>
        <Sparkline points={points} />
      </div>
    </DashboardPanel>
  );
}

function BarMetricCard({ title, value, delta, bars }) {
  return (
    <DashboardPanel className="dashboard-metric-card">
      <PanelTopline title={title} />
      <div className="dashboard-metric-split">
        <div className="dashboard-metric-copy dashboard-metric-copy--stacked">
          <strong>{value}</strong>
          <span className="dashboard-delta dashboard-delta--negative">{delta}</span>
        </div>
        <div className="dashboard-mini-bars" aria-hidden="true">
          {bars.map((bar, index) => (
            <span key={`${title}-${index}`} style={{ height: `${bar}%` }} />
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

function ScatterChart({ points }) {
  return (
    <div className="dashboard-scatter">
      <div className="dashboard-scatter-limit" />
      {points.map((point, index) => (
        <span
          key={`scatter-${index}`}
          className="dashboard-scatter-point"
          style={{
            left: `${point.x}%`,
            top: `${100 - point.y}%`,
          }}
        />
      ))}
    </div>
  );
}

function BarTrend({ bars }) {
  return (
    <div className="dashboard-bar-trend" aria-hidden="true">
      {bars.map((bar, index) => (
        <span key={`bar-${index}`} style={{ height: `${bar}%` }} />
      ))}
    </div>
  );
}

function StatusTag({ tone, children }) {
  return <span className={`dashboard-status dashboard-status--${tone.toLowerCase()}`}>{children}</span>;
}

function StoryCard({ title, subtitle, initials, accent = 'blue', create = false, image, onClick }) {
  return (
    <button
      type="button"
      className={`dashboard-story-card ${create ? 'dashboard-story-card--create' : ''} ${image ? 'dashboard-story-card--image' : ''}`}
      data-accent={accent}
      onClick={onClick}
    >
      {image ? <img src={image} alt="" className="dashboard-story-image" /> : null}
      <span className="dashboard-story-avatar">
        {create ? <IconPlusMini /> : initials}
      </span>
      <span className="dashboard-story-copy">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </span>
    </button>
  );
}

function DiscussionThread({ document, draftValue, onDraftChange, onSubmit }) {
  if (!document?.discussion?.length) {
    return null;
  }

  return (
    <div className="dashboard-discussion">
      <div className="dashboard-discussion-head">
        <strong>Live discussion</strong>
        <span>{document.discussion.length} notes · {document.collaborators.length} collaborators</span>
      </div>

      <div className="dashboard-discussion-list">
        {document.discussion.slice(0, 2).map((entry) => (
          <div className="dashboard-discussion-item" key={entry.id}>
            <div className="dashboard-discussion-avatar">{getInitials(entry.author)}</div>
            <div className="dashboard-discussion-body">
              <div className="dashboard-discussion-meta">
                <strong>{entry.author}</strong>
                <span>{entry.role} · {entry.time}</span>
              </div>
              <p>{entry.message}</p>

              {entry.replies?.length ? (
                <div className="dashboard-discussion-replies">
                  {entry.replies.slice(0, 2).map((reply) => (
                    <div className="dashboard-discussion-reply" key={reply.id}>
                      <span className="dashboard-discussion-reply-mark">Reply</span>
                      <div>
                        <strong>{reply.author}</strong>
                        <span>{reply.time}</span>
                        <p>{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-discussion-composer">
        <input
          type="text"
          value={draftValue}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Reply to this room conversation"
        />
        <button type="button" onClick={onSubmit} disabled={!draftValue.trim()}>
          Reply
        </button>
      </div>
    </div>
  );
}

function MenuRow({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" className={`dashboard-menu-row ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="dashboard-menu-row-icon">
        <Icon />
      </span>
      <span>{label}</span>
    </button>
  );
}

function TopNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" className={`dashboard-topnav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon />
      <span>{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const [documents, setDocuments] = useState(() => loadDocuments());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [activeView, setActiveView] = useState('');
  const [activeNavKey, setActiveNavKey] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [discussionDrafts, setDiscussionDrafts] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login', {
        replace: true,
        state: {
          from: location.pathname,
          mode: 'login',
        },
      });
      return;
    }

    try {
      setCurrentUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem('user');
      navigate('/login', {
        replace: true,
        state: {
          from: location.pathname,
          mode: 'login',
        },
      });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 1180px)');

    const syncViewport = (event) => {
      setIsCompactViewport(event.matches);
      if (!event.matches) {
        setIsDrawerOpen(false);
      }
    };

    syncViewport(mediaQuery);
    mediaQuery.addEventListener('change', syncViewport);

    return () => {
      mediaQuery.removeEventListener('change', syncViewport);
    };
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('dashboardTheme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
  }, []);

  const role = currentUser?.role === 'super-admin' ? 'super-admin' : 'user';
  const sidebarSections = role === 'super-admin' ? adminSections : userSections;
  const defaultView = useMemo(() => {
    const preferredItem = sidebarSections
      .flatMap((section) => section.items)
      .find((item) => item.active);

    return preferredItem?.label || sidebarSections[0]?.items?.[0]?.label || '';
  }, [sidebarSections]);

  const topNavItems =
    role === 'super-admin'
      ? [
          { key: 'overview', label: 'Overview', icon: IconGridMini, target: 'admin-overview' },
          { key: 'collections', label: 'Collections', icon: IconDocument, target: 'admin-collection-health' },
          { key: 'approvals', label: 'Approvals', icon: IconShieldMini, target: 'admin-approvals' },
          { key: 'governance', label: 'Governance', icon: IconBellMini, target: 'admin-governance' },
        ]
      : [
          { key: 'home', label: 'Home', icon: IconGridMini, target: 'user-feed' },
          { key: 'rooms', label: 'Rooms', icon: IconUsers, target: 'shared-spaces' },
          { key: 'reading', label: 'Reading', icon: IconDocument, target: 'reading-shelf' },
          { key: 'pulse', label: 'Pulse', icon: IconTrendMini, target: 'library-pulse' },
        ];

  useEffect(() => {
    setActiveView(defaultView);
    setActiveNavKey(navKeyForLabel(defaultView, role));
  }, [defaultView, role]);

  const firstName = useMemo(() => {
    if (!currentUser?.name) return role === 'super-admin' ? 'Admin' : 'Reader';
    return currentUser.name.split(' ')[0];
  }, [currentUser, role]);

  const avatarSrc = useMemo(
    () => currentUser?.avatar || createAvatarDataUri(currentUser?.name || firstName, role),
    [currentUser, firstName, role]
  );

  const myDocuments = documents.filter((doc) => doc.owner === 'You');
  const sharedDocuments = documents.filter((doc) => doc.owner !== 'You');
  const filteredShelf = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.preview.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query)
    );
  });
  const roomRouteTitles = useMemo(
    () => new Set([
      ...userSpaces.map((space) => space.title),
      ...userDiscoveries.map((space) => space.title),
      ...documents.map((document) => document.room),
    ]),
    [documents]
  );

  const sidebarQuickStats =
    role === 'super-admin'
      ? [
          { label: 'Approvals', value: accessRequests.length },
          { label: 'Alerts', value: governanceItems.length },
          { label: 'Collections', value: adminCollections.length },
        ]
      : [
          { label: 'My docs', value: myDocuments.length },
          { label: 'Shared', value: sharedDocuments.length },
          { label: 'Rooms', value: userSpaces.length },
        ];

  const storyCards = [
    {
      title: 'Create update',
      subtitle: 'Share a room note',
      initials: '+',
      accent: 'blue',
      create: true,
      onClick: handleNewDocument,
    },
    ...userSpaces.map((space, index) => ({
      title: space.title,
      subtitle: space.activity,
      initials: space.title
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      accent: ['blue', 'violet', 'green'][index % 3],
      image: space.image,
      onClick: () => handleOpenRoom(space.title),
    })),
  ];

  function commitDocuments(transform) {
    setDocuments((current) => {
      const nextDocuments = transform(current);
      saveDocuments(nextDocuments);
      return nextDocuments;
    });
  }

  function handleNewDocument() {
    const nextId = documents.reduce((highestId, doc) => Math.max(highestId, doc.id), 0) + 1;
    const newDoc = createDraftDocument({
      nextId,
      role,
      ownerName: currentUser?.name || firstName,
    });

    commitDocuments((current) => [newDoc, ...current]);
    navigate(`/editor/${newDoc.id}`);
  }

  function handleDocClick(docId) {
    navigate(`/editor/${docId}`);
  }

  function handleOpenRoom(roomName) {
    const roomSlug = slugifyRoomName(roomName);

    if (!roomSlug) {
      return;
    }

    setActiveNavKey('rooms');
    setActiveView(roomName);

    if (isCompactViewport) {
      setIsDrawerOpen(false);
    }

    navigate(`/rooms/${roomSlug}`);
  }

  function handleDiscussionDraftChange(docId, value) {
    setDiscussionDrafts((current) => ({
      ...current,
      [docId]: value,
    }));
  }

  function handleDiscussionSubmit(docId) {
    const draftValue = discussionDrafts[docId]?.trim();

    if (!draftValue) {
      return;
    }

    const authorName = currentUser?.name || firstName;

    commitDocuments((current) =>
      current.map((doc) => {
        if (doc.id !== docId) {
          return doc;
        }

        return {
          ...doc,
          lastModified: 'Just now',
          updatedBy: authorName,
          discussion: [
            ...doc.discussion,
            {
              id: `doc-${docId}-note-${Date.now()}`,
              author: authorName,
              role: role === 'super-admin' ? 'Super Admin' : 'Library User',
              time: 'Just now',
              message: draftValue,
              replies: [],
            },
          ],
        };
      })
    );

    setDiscussionDrafts((current) => ({
      ...current,
      [docId]: '',
    }));
  }

  function handleAvatarTrigger() {
    avatarInputRef.current?.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const nextUser = {
        ...currentUser,
        avatar: String(reader.result),
      };

      setCurrentUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function handleSignOut() {
    localStorage.removeItem('user');
    navigate('/');
  }

  function handleDrawerToggle() {
    setIsDrawerOpen((current) => !current);
  }

  function handleThemeToggle() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dashboardTheme', nextTheme);
  }

  function handleProfileMenuToggle() {
    setIsProfileMenuOpen((current) => !current);
  }

  function handleScrollTo(targetId, navKey) {
    setActiveNavKey(navKey);
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleSidebarItemClick(label) {
    setActiveView(label);
    const nextNavKey = navKeyForLabel(label, role);
    setActiveNavKey(nextNavKey);

    if (role !== 'super-admin' && roomRouteTitles.has(label)) {
      handleOpenRoom(label);
      return;
    }

    const targetMap =
      role === 'super-admin'
        ? {
            'Overview dashboard': 'admin-overview',
            'Collection health': 'admin-collection-health',
            'Response metrics': 'admin-throughput',
            'Review collaboration': 'admin-review-time',
            'Developer summary': 'admin-review-time',
            'Library metric grid': 'admin-throughput',
            'Governance workload': 'admin-governance',
            'Protected access': 'admin-approvals',
          }
        : {
            'Home feed': 'user-feed',
            'Reading shelf': 'reading-shelf',
            'Room pulse': 'library-pulse',
            'Humanities Reading Room': 'shared-spaces',
            'Research Support Hub': 'shared-spaces',
            'Archive Requests Board': 'shared-spaces',
            'Saved reading packs': 'reading-shelf',
            'Protected resources': 'library-pulse',
            'Shared notes': 'user-feed',
          };

    const targetId = targetMap[label];

    if (targetId) {
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (isCompactViewport) {
      setIsDrawerOpen(false);
    }
  }

  const sidebarContent = (
    <>
      <div className="dashboard-sidebar-card dashboard-profile-card">
        <button
          type="button"
          className={`dashboard-profile-toggle ${isProfileMenuOpen ? 'open' : ''}`}
          onClick={handleProfileMenuToggle}
          aria-expanded={isProfileMenuOpen}
          aria-label="Toggle profile menu"
        >
          <div className="dashboard-profile-head">
            <div className="dashboard-profile-avatar">
              <img src={avatarSrc} alt={`${currentUser?.name || firstName} profile`} />
            </div>

            <div className="dashboard-profile-copy">
              <span className="dashboard-profile-role">
                {role === 'super-admin' ? 'Super Admin' : 'Reader'}
              </span>
              <strong>{currentUser?.name || (role === 'super-admin' ? 'Super Admin' : 'Library User')}</strong>
            </div>
          </div>

          <span className="dashboard-profile-chevron" aria-hidden="true">
            <IconChevronMini />
          </span>
        </button>

        {isProfileMenuOpen ? (
          <div className="dashboard-profile-panel">
            <p className="dashboard-profile-description">
              {role === 'super-admin'
                ? 'Manage collections, permissions, and governance from one connected board.'
                : 'Follow rooms, shared reading, and library activity from a calmer social workspace.'}
            </p>

            <div className="dashboard-profile-actions">
              <button type="button" className="dashboard-inline-button" onClick={handleAvatarTrigger}>
                Update photo
              </button>
              <button
                type="button"
                className="dashboard-inline-button dashboard-inline-button--ghost"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="dashboard-sidebar-card">
        {sidebarSections.map((section) => (
          <div className="dashboard-menu-section" key={section.title}>
            <span className="dashboard-menu-section-title">{section.title}</span>
            <div className="dashboard-menu-list">
              {section.items.map((item) => {
                const Icon = menuIconForLabel(item.label);

                return (
                  <MenuRow
                    key={item.label}
                    icon={Icon}
                    label={item.label}
                    active={item.label === activeView}
                    onClick={() => handleSidebarItemClick(item.label)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sidebar-card dashboard-sidebar-card--stats">
        <PanelTopline title={role === 'super-admin' ? 'Control snapshot' : 'Reading snapshot'} />
        <div className="dashboard-stats-list">
          {sidebarQuickStats.map((stat) => (
            <div className="dashboard-stats-row" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className={`dashboard-app dashboard-app--${role}`} data-theme={theme}>
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="dashboard-avatar-input"
        onChange={handleAvatarChange}
      />

      <header className="dashboard-topbar">
        <div className="dashboard-topbar-start">
          <button
            type="button"
            className="dashboard-mobile-toggle"
            aria-label="Open menu"
            onClick={handleDrawerToggle}
          >
            <IconMenuMini />
          </button>

          <div className="dashboard-brand">
            <span className="dashboard-brand-mark">
              <img src="/thuto.png" alt="THUTOSHARE" className="dashboard-brand-logo" />
            </span>
            <span className="dashboard-brand-text">THUTOSHARE</span>
          </div>

          <label className="dashboard-topbar-search">
            <IconSearch />
            <input type="search" placeholder={role === 'super-admin' ? 'Search collections' : 'Search your library'} />
          </label>
        </div>

        <nav className="dashboard-topnav" aria-label="Dashboard sections">
          {topNavItems.map((item) => (
            <TopNavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNavKey === item.key}
              onClick={() => handleScrollTo(item.target, item.key)}
            />
          ))}
        </nav>

        <div className="dashboard-topbar-end">
          <button
            type="button"
            className="dashboard-theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="dashboard-theme-toggle-icon">
              <IconMoonMini />
            </span>
            <span className="dashboard-theme-toggle-icon">
              <IconSunMini />
            </span>
          </button>
          <button type="button" className="dashboard-topbar-icon" onClick={handleNewDocument} aria-label="Create new">
            <IconPlusMini />
          </button>
          <button type="button" className="dashboard-topbar-icon" aria-label="Saved items">
            <IconBookmarkMini />
          </button>
          <button type="button" className="dashboard-topbar-icon" aria-label="Notifications">
            <IconBellMini />
          </button>
          <button type="button" className="dashboard-topbar-avatar" onClick={handleAvatarTrigger} aria-label="Profile">
            <img src={avatarSrc} alt={`${currentUser.name || firstName} profile`} />
          </button>
        </div>
      </header>

      {isCompactViewport && isDrawerOpen ? (
        <button
          type="button"
          className="dashboard-drawer-backdrop"
          aria-label="Close drawer"
          onClick={handleDrawerToggle}
        />
      ) : null}

      <aside className={`dashboard-drawer ${isCompactViewport && isDrawerOpen ? 'open' : ''}`}>
        <div className="dashboard-drawer-shell">{sidebarContent}</div>
      </aside>

      <div className="dashboard-shell">
        <aside className="dashboard-column dashboard-column--left">{sidebarContent}</aside>

        <main className="dashboard-column dashboard-column--center">
          {role === 'super-admin' ? (
            <>
              <DashboardPanel id="admin-overview" className="dashboard-admin-hero">
                <div className="dashboard-admin-hero-copy">
                  <span className="dashboard-kicker">Operations board</span>
                  <h1>See the whole library operation in one professional flow.</h1>
                  <p>
                    Track review pace, approvals, governance, and collection movement from a centered board while the support context stays on the side.
                  </p>
                </div>

                <div className="dashboard-admin-hero-stats">
                  {sidebarQuickStats.map((stat) => (
                    <div className="dashboard-admin-hero-stat" key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </DashboardPanel>

              <section className="dashboard-metric-grid">
                <DonutMetricCard
                  title="Involvement"
                  value="25.15%"
                  detail="15 active spaces"
                  progress={25.15}
                />
                <SparkMetricCard
                  title="Response Time - Average"
                  value="8h"
                  delta="+32.9%"
                  points={adminResponsePoints}
                />
                <BarMetricCard
                  title="Comment count / review"
                  value="58"
                  delta="-9.4%"
                  bars={adminMetricBars}
                />
              </section>

              <section className="dashboard-admin-grid">
                <DashboardPanel className="dashboard-panel--span-2" id="admin-review-time">
                  <PanelTopline
                    title="Review Time Per Collection"
                    subtitle="Watch response clusters and pickup time across review activity."
                  />
                  <ScatterChart points={adminScatterPoints} />
                </DashboardPanel>

                <DashboardPanel className="dashboard-panel--span-2" id="admin-throughput">
                  <PanelTopline
                    title="Collection Throughput - Trend"
                    subtitle="Recent movement across curated resources, approvals, and published spaces."
                  />
                  <BarTrend bars={adminThroughputBars} />
                </DashboardPanel>

                <DashboardPanel>
                  <PanelTopline title="Active Reviewers Average" />
                  <div className="dashboard-side-stat">
                    <strong>3</strong>
                    <span>Reviewers working now</span>
                  </div>
                  <BarTrend bars={adminReviewerBars} />
                </DashboardPanel>

                <DashboardPanel>
                  <PanelTopline title="Protected Access Watch" />
                  <div className="dashboard-side-stat">
                    <strong>81%</strong>
                    <span>Permissions reconciled this week</span>
                  </div>
                  <BarTrend bars={userRoomPulseBars} />
                </DashboardPanel>
              </section>
            </>
          ) : (
            <>
              <section className="dashboard-composer-card" id="user-composer">
                <div className="dashboard-composer-head">
                  <button
                    type="button"
                    className="dashboard-composer-avatar"
                    onClick={handleAvatarTrigger}
                    aria-label="Update profile photo"
                  >
                    <img src={avatarSrc} alt={`${currentUser.name || firstName} profile`} />
                  </button>

                  <button type="button" className="dashboard-composer-input" onClick={handleNewDocument}>
                    What is happening in your reading world, {firstName}?
                  </button>
                </div>

                <div className="dashboard-composer-actions">
                  <button type="button" className="dashboard-composer-action" onClick={handleNewDocument}>
                    <IconDocument />
                    <span>Share note</span>
                  </button>
                  <button type="button" className="dashboard-composer-action" onClick={() => handleOpenRoom(userSpaces[0].title)}>
                    <IconUsers />
                    <span>Open room</span>
                  </button>
                  <button type="button" className="dashboard-composer-action" onClick={() => handleScrollTo('reading-shelf', 'reading')}>
                    <IconBookmarkMini />
                    <span>Save reading</span>
                  </button>
                </div>
              </section>

              <section className="dashboard-story-strip" id="shared-spaces">
                {storyCards.map((story) => (
                  <StoryCard
                    key={`${story.title}-${story.subtitle}`}
                    title={story.title}
                    subtitle={story.subtitle}
                    initials={story.initials}
                    accent={story.accent}
                    create={story.create}
                    image={story.image}
                    onClick={story.onClick}
                  />
                ))}
              </section>

              <div className="dashboard-feed-stack" id="user-feed">
                {userFeedPosts.map((post) => {
                  const linkedDocument = documents.find((doc) => doc.id === post.docId);

                  return (
                    <article className="dashboard-feed-post" key={`${post.author}-${post.title}`}>
                      <div className="dashboard-feed-post-head">
                        <div className="dashboard-feed-author">
                          <div className="dashboard-feed-avatar">{post.author.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <strong>{post.author}</strong>
                            <span>{post.role} · {post.room} · {post.time}</span>
                          </div>
                        </div>
                        <span className="dashboard-feed-label">{post.type}</span>
                      </div>

                      <div className="dashboard-feed-post-body">
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>

                        {post.image ? (
                          <div className="dashboard-feed-media">
                            <img src={post.image} alt="" className="dashboard-feed-media-image" />
                          </div>
                        ) : null}

                        <div className="dashboard-feed-tags">
                          {post.tags.map((tag) => (
                            <span className="dashboard-feed-tag" key={tag}>{tag}</span>
                          ))}
                        </div>

                        {linkedDocument ? (
                          <button
                            type="button"
                            className="dashboard-feed-document"
                            onClick={() => handleDocClick(linkedDocument.id)}
                          >
                            <div>
                              <strong>{linkedDocument.title}</strong>
                              <span>{linkedDocument.type} · {linkedDocument.lastModified}</span>
                              <p className="dashboard-feed-document-preview">{linkedDocument.preview}</p>
                              <div className="dashboard-feed-document-meta">
                                <span>{linkedDocument.collaborators.length} collaborators</span>
                                <span>{linkedDocument.visibility}</span>
                              </div>
                            </div>
                            <span className="dashboard-feed-document-open">Open</span>
                          </button>
                        ) : null}

                        {linkedDocument ? (
                          <DiscussionThread
                            document={linkedDocument}
                            draftValue={discussionDrafts[linkedDocument.id] || ''}
                            onDraftChange={(value) => handleDiscussionDraftChange(linkedDocument.id, value)}
                            onSubmit={() => handleDiscussionSubmit(linkedDocument.id)}
                          />
                        ) : null}
                      </div>

                      <div className="dashboard-feed-post-footer">
                        <span>{post.engagement}</span>
                        <div className="dashboard-feed-actions">
                          <button
                            type="button"
                            className="dashboard-link-button"
                            onClick={() => handleOpenRoom(post.room)}
                          >
                            Discuss
                          </button>
                          <button
                            type="button"
                            className="dashboard-link-button"
                            onClick={() => handleDocClick(post.docId)}
                          >
                            Open document
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </main>

        <aside className="dashboard-column dashboard-column--right">
          {role === 'super-admin' ? (
            <div className="dashboard-sidebar-stack">
              <DashboardPanel className="dashboard-side-card" id="admin-approvals">
                <PanelTopline title="Pending approvals" subtitle="Requests waiting for action." />
                <div className="dashboard-compact-list">
                  {accessRequests.map((request) => (
                    <div className="dashboard-compact-item dashboard-compact-item--media" key={request.name}>
                      <div className="dashboard-compact-thumb">
                        <img src={request.image} alt="" />
                      </div>
                      <div className="dashboard-compact-item-body">
                        <div className="dashboard-compact-topline">
                          <strong>{request.name}</strong>
                          <StatusTag tone={request.priority}>{request.priority}</StatusTag>
                        </div>
                        <p>{request.request}</p>
                        <span className="dashboard-compact-item-meta">{request.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card" id="admin-collection-health">
                <PanelTopline title="Collection health" subtitle="Live status across major collections." />
                <div className="dashboard-collection-list">
                  {adminCollections.map((collection) => (
                    <div className="dashboard-collection-row dashboard-collection-row--media" key={collection.name}>
                      <div className="dashboard-collection-main">
                        <div className="dashboard-compact-thumb">
                          <img src={collection.image} alt="" />
                        </div>
                        <div>
                          <strong>{collection.name}</strong>
                          <p>{collection.note}</p>
                        </div>
                      </div>
                      <div className="dashboard-collection-meta">
                        <span>{collection.usage}</span>
                        <StatusTag tone={collection.state}>{collection.state}</StatusTag>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card" id="admin-governance">
                <PanelTopline title="Governance alerts" subtitle="What needs policy attention." />
                <div className="dashboard-compact-list">
                  {governanceItems.map((item) => (
                    <div className="dashboard-compact-item dashboard-compact-item--media" key={item.title}>
                      <div className="dashboard-compact-thumb">
                        <img src={item.image} alt="" />
                      </div>
                      <div className="dashboard-compact-item-body">
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            </div>
          ) : (
            <div className="dashboard-sidebar-stack">
              <DashboardPanel className="dashboard-side-card" id="reading-shelf">
                <PanelTopline title="Continue reading" subtitle="Your active reading shelf." />
                <div className="dashboard-shelf-search">
                  <IconSearch />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search your shelf"
                  />
                </div>

                <div className="dashboard-shelf-list">
                  {filteredShelf.length ? (
                    filteredShelf.slice(0, 4).map((doc) => (
                      <button
                        type="button"
                        key={doc.id}
                        className="dashboard-shelf-row"
                        onClick={() => handleDocClick(doc.id)}
                      >
                        <div className="dashboard-shelf-icon">
                          <IconDocument />
                        </div>
                        <div className="dashboard-shelf-copy">
                          <strong>{doc.title}</strong>
                          <p>{doc.preview}</p>
                          <div className="dashboard-shelf-meta">
                            <span>{doc.type}</span>
                            <span>{doc.lastModified}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="dashboard-empty-state">
                      Nothing matched your shelf search yet. Try another title, type, or keyword.
                    </div>
                  )}
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card">
                <PanelTopline title="Upcoming" subtitle="What is next in your week." />
                <div className="dashboard-compact-list">
                  {userUpcoming.map((item) => (
                    <button
                      type="button"
                      className="dashboard-compact-item dashboard-compact-item--media dashboard-compact-item--action"
                      key={item.title}
                      onClick={() => handleOpenRoom(item.room)}
                    >
                      <div className="dashboard-compact-thumb">
                        <img src={item.image} alt="" />
                      </div>
                      <div className="dashboard-compact-item-body">
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                        <span className="dashboard-compact-item-meta">{item.meta}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card">
                <PanelTopline title="Suggested rooms" subtitle="Spaces worth joining." />
                <div className="dashboard-compact-list">
                  {userDiscoveries.map((room) => (
                    <button
                      type="button"
                      className="dashboard-compact-item dashboard-compact-item--media dashboard-compact-item--action"
                      key={room.title}
                      onClick={() => handleOpenRoom(room.title)}
                    >
                      <div className="dashboard-compact-thumb">
                        <img src={room.image} alt="" />
                      </div>
                      <div className="dashboard-compact-item-body">
                        <div className="dashboard-compact-topline">
                          <strong>{room.title}</strong>
                          <span>{room.meta}</span>
                        </div>
                        <p>{room.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card" id="library-pulse">
                <PanelTopline title="Library pulse" subtitle="What is moving around the platform." />
                <div className="dashboard-pulse-list">
                  {userPulse.map((item) => (
                    <button
                      type="button"
                      className="dashboard-pulse-item dashboard-pulse-item--action"
                      key={item.label}
                      onClick={() => handleOpenRoom(item.room)}
                    >
                      <div className="dashboard-pulse-thumb">
                        <img src={item.image} alt="" />
                      </div>
                      <div className="dashboard-pulse-copy">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="dashboard-compact-note">
                  Room activity is up this week, and protected collections are still controlled by access rules and approval checks.
                </div>
              </DashboardPanel>

              <DashboardPanel className="dashboard-side-card">
                <PanelTopline title="Room momentum" subtitle="A quick activity read." />
                <div className="dashboard-side-stat">
                  <strong>81%</strong>
                  <span>Shared room activity this week</span>
                </div>
                <BarTrend bars={userRoomPulseBars} />
              </DashboardPanel>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

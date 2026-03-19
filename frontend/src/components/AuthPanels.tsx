import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthModal.css';

export type AuthModalKind = 'student' | 'admin';

type AuthPanelProps = {
  kind: AuthModalKind;
  onClose?: () => void;
  notice?: string;
};

type AuthModalProps = {
  kind: AuthModalKind;
  onClose: () => void;
  notice?: string;
};

type PanelContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  helper: string;
  accent: 'student' | 'admin';
};

const panelContent: Record<AuthModalKind, PanelContent> = {
  student: {
    eyebrow: 'Student access',
    title: 'Student login',
    subtitle: 'Use your student email address and password to access elections, party slates, and results.',
    submitLabel: 'Continue to elections',
    helper: 'Use your student email address and password.',
    accent: 'student',
  },
  admin: {
    eyebrow: '',
    title: 'Sign in',
    subtitle: 'THUTO runs secure university elections end to end, from candidate setup and voter rolls to transparent results.',
    submitLabel: 'Open admin dashboard',
    helper: 'Use your assigned admin email and password.',
    accent: 'admin',
  },
};

function AuthPanel({ kind, onClose, notice }: AuthPanelProps): JSX.Element {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const content = panelContent[kind];
  const isAdminPanel = kind === 'admin';
  const showPill = Boolean(content.eyebrow.trim());
  const helperText = content.helper;

  useEffect(() => {
    setError('');
    setPassword('');
  }, [kind]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const userIsAdmin = user.role === 'admin' || user.role === 'super_admin';

      if (isAdminPanel && !userIsAdmin) {
        logout();
        setError('Admin privileges are required to continue.');
        return;
      }

      const destination =
        user.role === 'super_admin'
          ? '/super-admin'
          : user.role === 'admin'
            ? '/admin'
            : '/elections';
      onClose?.();
      navigate(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`auth-panel auth-panel--${content.accent}`}>
      <div className={`auth-panel__topbar${showPill ? '' : ' auth-panel__topbar--no-pill'}`}>
        {showPill && (
          <div className="auth-panel__pill">
            {isAdminPanel ? <ShieldCheck size={15} /> : <GraduationCap size={15} />}
            {content.eyebrow}
          </div>
        )}

        {onClose && (
          <button type="button" className="auth-panel__close" onClick={onClose} aria-label="Close login popup">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="auth-panel__header">
        <h2 id={`${kind}-auth-title`}>{content.title}</h2>
        <p>{content.subtitle}</p>
      </div>

      <div className="auth-panel__highlights" aria-hidden="true">
        <div className="auth-panel__highlight">
          <UserRound size={16} />
          <span>{isAdminPanel ? 'Role-based access' : 'Election access'}</span>
        </div>
        <div className="auth-panel__highlight">
          <LockKeyhole size={16} />
          <span>{isAdminPanel ? 'Dashboard security' : 'Secure sign-in'}</span>
        </div>
      </div>

      <form className="auth-panel__form" onSubmit={handleSubmit}>
        <label className="auth-panel__field">
          <span>Email address</span>
          <div className="auth-panel__input-shell">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isAdminPanel ? 'admin@thuto.bac.ac.bw' : 'student@thuto.bac.ac.bw'}
              autoComplete="email"
              required
              autoFocus
            />
          </div>
        </label>

        <label className="auth-panel__field">
          <span>Password</span>
          <div className="auth-panel__input-shell">
            <LockKeyhole size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete={isAdminPanel ? 'current-password' : 'current-password'}
              required
            />
            <button
              type="button"
              className="auth-panel__password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <p className="auth-panel__helper">{helperText}</p>

        {notice && <div className="auth-panel__notice">{notice}</div>}
        {error && <div className="auth-panel__error">{error}</div>}

        <button type="submit" className="auth-panel__submit" disabled={loading}>
          {loading ? 'Signing in...' : content.submitLabel}
          {!loading && <ChevronRight size={16} />}
        </button>
      </form>
    </section>
  );
}

export function StudentLoginPanel(props: Omit<AuthPanelProps, 'kind'>): JSX.Element {
  return <AuthPanel kind="student" {...props} />;
}

export function AdminLoginPanel(props: Omit<AuthPanelProps, 'kind'>): JSX.Element {
  return <AuthPanel kind="admin" {...props} />;
}

export function AuthModal({ kind, onClose, notice }: AuthModalProps): JSX.Element {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby={`${kind}-auth-title`} onClick={onClose}>
      <div className="auth-modal__dialog" onClick={(event) => event.stopPropagation()}>
        {kind === 'student' ? <StudentLoginPanel onClose={onClose} notice={notice} /> : <AdminLoginPanel onClose={onClose} notice={notice} />}
      </div>
    </div>
  );
}

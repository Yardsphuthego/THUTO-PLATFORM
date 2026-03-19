import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  CircleAlert,
  FileText,
  LayoutGrid,
  Moon,
  ShieldCheck,
  SunMedium,
  Users,
  Vote,
} from 'lucide-react';
import { candidateService, electionService } from '../services/api';
import { Candidate, Election } from '../types';
import '../styles/Elections.css';

type PartySlate = {
  partyName: string;
  partyLogo?: string | null;
  candidates: Candidate[];
};

type DashboardTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'thuto-student-dashboard-apple-theme';

const formatElectionDate = (value: string) =>
  new Intl.DateTimeFormat('en-BW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const getPartyName = (partyName?: string | null) => partyName?.trim() || 'Independent';

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'CA';

const getInitialTheme = (): DashboardTheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return 'light';
};

export const Elections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<DashboardTheme>(getInitialTheme);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [electionsResponse, candidatesResponse] = await Promise.all([
          electionService.listElections(),
          candidateService.listCandidates(),
        ]);

        setElections(electionsResponse.data);
        setCandidates(candidatesResponse.data);
        setError('');
      } catch (err) {
        setError('Failed to load elections and party slates');
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const electionsWithParties = useMemo(() => {
    return elections.map((election) => {
      const electionCandidates = candidates
        .filter((candidate) => candidate.election_id === election.id)
        .sort((left, right) => {
          const positionCompare = left.position.localeCompare(right.position);
          return positionCompare !== 0
            ? positionCompare
            : left.candidate_name.localeCompare(right.candidate_name);
        });

      const partyGroups = electionCandidates.reduce<Map<string, Candidate[]>>((groups, candidate) => {
        const partyName = getPartyName(candidate.party_name);
        const existing = groups.get(partyName) || [];
        existing.push(candidate);
        groups.set(partyName, existing);
        return groups;
      }, new Map());

      const parties: PartySlate[] = Array.from(partyGroups.entries())
        .map(([partyName, partyCandidates]) => ({
          partyName,
          partyLogo: partyCandidates.find((candidate) => candidate.party_logo)?.party_logo || null,
          candidates: partyCandidates,
        }))
        .sort((left, right) => left.partyName.localeCompare(right.partyName));

      return {
        election,
        parties,
        candidateCount: electionCandidates.length,
        positionCount: new Set(electionCandidates.map((candidate) => candidate.position)).size,
      };
    });
  }, [candidates, elections]);

  const dashboardTotals = useMemo(
    () => ({
      elections: electionsWithParties.length,
      parties: electionsWithParties.reduce((total, item) => total + item.parties.length, 0),
      candidates: electionsWithParties.reduce((total, item) => total + item.candidateCount, 0),
      positions: electionsWithParties.reduce((total, item) => total + item.positionCount, 0),
    }),
    [electionsWithParties]
  );

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <main className="elections-page" data-theme={theme}>
        <div className="elections-page__loading">
          <div className="elections-page__state-icon">
            <LayoutGrid size={28} strokeWidth={1.9} />
          </div>
          Loading elections and party slates...
        </div>
      </main>
    );
  }

  return (
    <main className="elections-page" data-theme={theme}>
      <section className="elections-page__hero">
        <div className="elections-page__hero-top">
          <div>
            <span className="elections-page__eyebrow">
              <Vote size={14} strokeWidth={1.9} />
              Student Dashboard
            </span>
            <h1>Available elections and party slates</h1>
            <p>
              Review each party, candidate position, and manifesto before you continue with voting.
            </p>
          </div>

          <button
            type="button"
            className="elections-page__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunMedium size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="elections-page__hero-metrics">
          <div className="elections-page__hero-metric">
            <LayoutGrid size={18} strokeWidth={1.9} />
            <div>
              <strong>{dashboardTotals.elections}</strong>
              <span>Elections</span>
            </div>
          </div>
          <div className="elections-page__hero-metric">
            <Users size={18} strokeWidth={1.9} />
            <div>
              <strong>{dashboardTotals.parties}</strong>
              <span>Parties</span>
            </div>
          </div>
          <div className="elections-page__hero-metric">
            <BookOpen size={18} strokeWidth={1.9} />
            <div>
              <strong>{dashboardTotals.candidates}</strong>
              <span>Candidates</span>
            </div>
          </div>
          <div className="elections-page__hero-metric">
            <ShieldCheck size={18} strokeWidth={1.9} />
            <div>
              <strong>{dashboardTotals.positions}</strong>
              <span>Positions</span>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="elections-page__error">
          <div className="elections-page__state-icon">
            <CircleAlert size={22} strokeWidth={1.9} />
          </div>
          <span>{error}</span>
        </div>
      )}

      {electionsWithParties.length === 0 ? (
        <section className="elections-page__empty">
          <div className="elections-page__state-icon">
            <LayoutGrid size={28} strokeWidth={1.9} />
          </div>
          <h2>No elections available yet</h2>
          <p>The super admin has not published any elections or party slates yet.</p>
        </section>
      ) : (
        <section className="elections-page__grid">
          {electionsWithParties.map(({ election, parties, candidateCount, positionCount }) => (
            <article key={election.id} className="election-card">
              <div className="election-card__header">
                <div>
                  <span className={`status-badge status-badge--${election.status}`}>
                    {election.status}
                  </span>
                  <h2>{election.title}</h2>
                </div>
                <div className="election-card__stats">
                  <div>
                    <strong>{parties.length}</strong>
                    <span>parties</span>
                  </div>
                  <div>
                    <strong>{candidateCount}</strong>
                    <span>candidates</span>
                  </div>
                  <div>
                    <strong>{positionCount}</strong>
                    <span>positions</span>
                  </div>
                </div>
              </div>

              <p className="election-card__description">
                {election.description || 'No election description has been provided yet.'}
              </p>

              <div className="election-card__schedule">
                <div>
                  <span>
                    <CalendarDays size={14} strokeWidth={1.9} />
                    Starts
                  </span>
                  <strong>{formatElectionDate(election.start_date)}</strong>
                </div>
                <div>
                  <span>
                    <CalendarDays size={14} strokeWidth={1.9} />
                    Ends
                  </span>
                  <strong>{formatElectionDate(election.end_date)}</strong>
                </div>
              </div>

              {parties.length === 0 ? (
                <div className="election-card__empty-slate">
                  Party and candidate details will appear here once the super admin adds them.
                </div>
              ) : (
                <div className="election-card__parties">
                  {parties.map((party) => (
                    <section key={`${election.id}-${party.partyName}`} className="party-slate">
                      <div className="party-slate__header">
                        <div className="party-slate__identity">
                          <div className="party-slate__logo">
                            {party.partyLogo ? (
                              <img src={party.partyLogo} alt={party.partyName} />
                            ) : (
                              <LayoutGrid size={18} strokeWidth={1.9} />
                            )}
                          </div>
                          <div>
                          <span className="party-slate__label">Party</span>
                          <h3>{party.partyName}</h3>
                          </div>
                        </div>
                        <span className="party-slate__count">
                          <Users size={14} strokeWidth={1.9} />
                          {party.candidates.length} candidate{party.candidates.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="party-slate__candidates">
                        {party.candidates.map((candidate) => (
                          <article key={candidate.id} className="candidate-card">
                            <div className="candidate-card__top">
                              <div className="candidate-card__avatar">
                                {candidate.candidate_photo ? (
                                  <img src={candidate.candidate_photo} alt={candidate.candidate_name} />
                                ) : (
                                  <span>{getInitials(candidate.candidate_name)}</span>
                                )}
                              </div>
                              <div>
                                <span className="candidate-card__position">
                                  <ShieldCheck size={13} strokeWidth={1.9} />
                                  {candidate.position}
                                </span>
                                <h4>{candidate.candidate_name}</h4>
                              </div>
                            </div>
                            <div className="candidate-card__manifesto-label">
                              <FileText size={14} strokeWidth={1.9} />
                              Manifesto
                            </div>
                            <p className="candidate-card__manifesto">
                              {candidate.manifesto || 'No manifesto provided yet.'}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

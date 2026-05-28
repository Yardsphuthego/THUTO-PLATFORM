import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconArrow, IconDocument, IconSearch, IconUsers } from '../components/Icons';
import {
  createDraftDocument,
  loadDocuments,
  loadRooms,
  saveDocuments,
  saveRooms,
  slugifyRoomName,
} from '../lib/mockLibraryData';
import '../styles/Room.css';

function getInitials(name) {
  return (name || 'User')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

function RoomThreadCard({
  entry,
  linkedDocument,
  replyValue,
  onReplyChange,
  onReplySubmit,
  onOpenDocument,
}) {
  return (
    <article className="room-thread-card">
      <div className="room-thread-head">
        <div className="room-thread-author">
          <div className="room-thread-avatar">{getInitials(entry.author)}</div>
          <div>
            <strong>{entry.author}</strong>
            <span>{entry.role} · {entry.time}</span>
          </div>
        </div>

        {entry.linkedDocId && linkedDocument ? (
          <button type="button" className="room-thread-doc-link" onClick={() => onOpenDocument(linkedDocument.id)}>
            Linked document
          </button>
        ) : null}
      </div>

      <p className="room-thread-message">{entry.message}</p>

      {linkedDocument ? (
        <button
          type="button"
          className="room-thread-document"
          onClick={() => onOpenDocument(linkedDocument.id)}
        >
          <div className="room-thread-document-icon">
            <IconDocument />
          </div>
          <div className="room-thread-document-copy">
            <strong>{linkedDocument.title}</strong>
            <span>{linkedDocument.type} · {linkedDocument.lastModified}</span>
            <p>{linkedDocument.preview}</p>
          </div>
        </button>
      ) : null}

      {entry.replies?.length ? (
        <div className="room-thread-replies">
          {entry.replies.map((reply) => (
            <div className="room-thread-reply" key={reply.id}>
              <div className="room-thread-reply-mark">Reply</div>
              <div className="room-thread-reply-body">
                <div className="room-thread-reply-meta">
                  <strong>{reply.author}</strong>
                  <span>{reply.role} · {reply.time}</span>
                </div>
                <p>{reply.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="room-thread-compose">
        <input
          type="text"
          value={replyValue}
          onChange={(event) => onReplyChange(event.target.value)}
          placeholder="Reply to this room thread"
        />
        <button type="button" onClick={onReplySubmit} disabled={!replyValue.trim()}>
          Reply
        </button>
      </div>
    </article>
  );
}

export default function Room() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState(() => loadDocuments());
  const [rooms, setRooms] = useState(() => loadRooms());
  const [composerValue, setComposerValue] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');

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
    const storedTheme = localStorage.getItem('dashboardTheme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
  }, []);

  const room = useMemo(
    () => rooms.find((entry) => entry.slug === slugifyRoomName(slug)),
    [rooms, slug]
  );

  const roomDocuments = useMemo(() => {
    if (!room) {
      return [];
    }

    return documents.filter((document) => slugifyRoomName(document.room) === room.slug);
  }, [documents, room]);

  const roomMembers = useMemo(() => {
    if (!room) {
      return [];
    }

    const people = new Map();
    const addPerson = (name, role) => {
      if (!name) return;
      const key = `${name}-${role || ''}`;
      if (!people.has(key)) {
        people.set(key, { name, role: role || 'Member' });
      }
    };

    room.moderators?.forEach((name) => addPerson(name, 'Moderator'));
    room.discussion.forEach((entry) => {
      addPerson(entry.author, entry.role);
      entry.replies?.forEach((reply) => addPerson(reply.author, reply.role));
    });
    roomDocuments.forEach((document) => {
      document.collaborators?.forEach((collaborator) => addPerson(collaborator.name, collaborator.role));
    });

    return Array.from(people.values()).slice(0, 8);
  }, [room, roomDocuments]);

  const filteredRoomDocuments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return roomDocuments;
    }

    return roomDocuments.filter((document) => (
      document.title.toLowerCase().includes(query) ||
      document.preview.toLowerCase().includes(query) ||
      document.type.toLowerCase().includes(query)
    ));
  }, [roomDocuments, searchQuery]);

  const role = currentUser?.role === 'super-admin' ? 'super-admin' : 'user';
  const displayRole = role === 'super-admin' ? 'Super Admin' : 'Library User';
  const firstName = currentUser?.name?.split(' ')[0] || 'Reader';

  function persistRooms(transform) {
    setRooms((currentRooms) => {
      const nextRooms = transform(currentRooms);
      saveRooms(nextRooms);
      return nextRooms;
    });
  }

  function persistDocuments(transform) {
    setDocuments((currentDocuments) => {
      const nextDocuments = transform(currentDocuments);
      saveDocuments(nextDocuments);
      return nextDocuments;
    });
  }

  function handleThemeToggle() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dashboardTheme', nextTheme);
  }

  function handleOpenDocument(docId) {
    navigate(`/editor/${docId}`, {
      state: {
        from: location.pathname,
      },
    });
  }

  function handleCreateDocument() {
    if (!room) {
      return;
    }

    const nextId = documents.reduce((highestId, document) => Math.max(highestId, document.id), 0) + 1;
    const nextDocument = {
      ...createDraftDocument({
        nextId,
        role,
        ownerName: currentUser?.name || firstName,
      }),
      room: room.title,
      visibility: role === 'super-admin' ? 'Operations workspace' : `Shared with ${room.title}`,
      preview: `A fresh shared document for ${room.title}.`,
    };

    persistDocuments((currentDocuments) => [nextDocument, ...currentDocuments]);
    navigate(`/editor/${nextDocument.id}`, {
      state: {
        from: location.pathname,
      },
    });
  }

  function handleComposerSubmit() {
    const nextMessage = composerValue.trim();

    if (!nextMessage || !room) {
      return;
    }

    const nextEntry = {
      id: `room-${room.slug}-${Date.now()}`,
      author: currentUser?.name || 'You',
      role: displayRole,
      time: 'Just now',
      message: nextMessage,
      replies: [],
    };

    persistRooms((currentRooms) =>
      currentRooms.map((entry) => (
        entry.slug === room.slug
          ? {
              ...entry,
              discussion: [nextEntry, ...entry.discussion],
            }
          : entry
      ))
    );

    setComposerValue('');
  }

  function handleReplyDraftChange(threadId, value) {
    setReplyDrafts((currentDrafts) => ({
      ...currentDrafts,
      [threadId]: value,
    }));
  }

  function handleReplySubmit(threadId) {
    const nextMessage = replyDrafts[threadId]?.trim();

    if (!nextMessage || !room) {
      return;
    }

    const nextReply = {
      id: `reply-${threadId}-${Date.now()}`,
      author: currentUser?.name || 'You',
      role: displayRole,
      time: 'Just now',
      message: nextMessage,
    };

    persistRooms((currentRooms) =>
      currentRooms.map((entry) => (
        entry.slug === room.slug
          ? {
              ...entry,
              discussion: entry.discussion.map((thread) => (
                thread.id === threadId
                  ? {
                      ...thread,
                      replies: [...(thread.replies || []), nextReply],
                    }
                  : thread
              )),
            }
          : entry
      ))
    );

    setReplyDrafts((currentDrafts) => ({
      ...currentDrafts,
      [threadId]: '',
    }));
  }

  if (!currentUser) {
    return null;
  }

  if (!room) {
    return (
      <div className="room-page room-page--empty" data-theme={theme}>
        <div className="room-empty-state">
          <h1>Room not found</h1>
          <p>The room you opened could not be found in this workspace.</p>
          <button type="button" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-page" data-theme={theme}>
      <header className="room-topbar">
        <div className="room-topbar-start">
          <button type="button" className="room-back-button" onClick={() => navigate('/dashboard')}>
            <span className="room-back-icon">
              <IconArrow />
            </span>
            <span>Dashboard</span>
          </button>

          <div className="room-brand">
            <img src="/thuto.png" alt="THUTOSHARE" />
            <div className="room-brand-copy">
              <span>THUTOSHARE Room</span>
              <strong>{room.title}</strong>
            </div>
          </div>
        </div>

        <div className="room-topbar-actions">
          <button
            type="button"
            className="room-theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span><IconMoonMini /></span>
            <span><IconSunMini /></span>
          </button>
          <button type="button" className="room-primary-button" onClick={handleCreateDocument}>
            New document
          </button>
        </div>
      </header>

      <section className="room-hero">
        <div className="room-hero-media">
          <img src={room.image} alt="" />
        </div>

        <div className="room-hero-copy">
          <span className="room-kicker">Collaboration room</span>
          <h1>{room.title}</h1>
          <p>{room.description}</p>

          <div className="room-hero-meta">
            <div>
              <strong>{room.members}</strong>
              <span>Members</span>
            </div>
            <div>
              <strong>{room.onlineNow}</strong>
              <span>Online now</span>
            </div>
            <div>
              <strong>{roomDocuments.length}</strong>
              <span>Shared docs</span>
            </div>
          </div>
        </div>
      </section>

      <div className="room-shell">
        <aside className="room-column room-column--left">
          <section className="room-panel">
            <div className="room-panel-topline">
              <h2>Room focus</h2>
              <span>{room.subtitle}</span>
            </div>
            <div className="room-next-session">
              <span>Next session</span>
              <strong>{room.nextSession}</strong>
            </div>
            <div className="room-highlight-list">
              {room.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </section>

          <section className="room-panel">
            <div className="room-panel-topline">
              <h2>Working guidelines</h2>
              <span>Keep the collaboration tidy.</span>
            </div>
            <div className="room-rule-list">
              {room.guidelines.map((guideline) => (
                <div className="room-rule-item" key={guideline}>
                  <span />
                  <p>{guideline}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main className="room-column room-column--center">
          <section className="room-compose-card">
            <div className="room-compose-head">
              <div className="room-compose-avatar">{getInitials(currentUser.name || firstName)}</div>
              <div>
                <strong>{currentUser.name || 'You'}</strong>
                <span>{displayRole}</span>
              </div>
            </div>
            <textarea
              value={composerValue}
              onChange={(event) => setComposerValue(event.target.value)}
              placeholder={`Share a room update, question, or reply for ${room.title}`}
            />
            <div className="room-compose-actions">
              <button type="button" className="room-secondary-button" onClick={handleCreateDocument}>
                Attach document
              </button>
              <button type="button" className="room-primary-button" onClick={handleComposerSubmit} disabled={!composerValue.trim()}>
                Post update
              </button>
            </div>
          </section>

          <section className="room-thread-stack">
            {room.discussion.map((entry) => {
              const linkedDocument = entry.linkedDocId
                ? roomDocuments.find((document) => document.id === entry.linkedDocId) ||
                  documents.find((document) => document.id === entry.linkedDocId)
                : null;

              return (
                <RoomThreadCard
                  key={entry.id}
                  entry={entry}
                  linkedDocument={linkedDocument}
                  replyValue={replyDrafts[entry.id] || ''}
                  onReplyChange={(value) => handleReplyDraftChange(entry.id, value)}
                  onReplySubmit={() => handleReplySubmit(entry.id)}
                  onOpenDocument={handleOpenDocument}
                />
              );
            })}
          </section>
        </main>

        <aside className="room-column room-column--right">
          <section className="room-panel">
            <div className="room-panel-topline">
              <h2>Shared documents</h2>
              <span>Open the files moving this room.</span>
            </div>

            <label className="room-search">
              <IconSearch />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search room documents"
              />
            </label>

            <div className="room-document-list">
              {filteredRoomDocuments.length ? (
                filteredRoomDocuments.map((document) => (
                  <button
                    type="button"
                    className="room-document-card"
                    key={document.id}
                    onClick={() => handleOpenDocument(document.id)}
                  >
                    <div className="room-document-card-icon">
                      <IconDocument />
                    </div>
                    <div className="room-document-card-copy">
                      <strong>{document.title}</strong>
                      <span>{document.type} · {document.lastModified}</span>
                      <p>{document.preview}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="room-empty-copy">No room documents matched that search yet.</div>
              )}
            </div>
          </section>

          <section className="room-panel">
            <div className="room-panel-topline">
              <h2>Active people</h2>
              <span>{roomMembers.length} visible collaborators</span>
            </div>

            <div className="room-member-list">
              {roomMembers.map((member) => (
                <div className="room-member-row" key={`${member.name}-${member.role}`}>
                  <div className="room-member-avatar">{getInitials(member.name)}</div>
                  <div className="room-member-copy">
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="room-panel room-panel--summary">
            <div className="room-panel-topline">
              <h2>Collaboration snapshot</h2>
              <span>What this room is doing right now.</span>
            </div>

            <div className="room-summary-grid">
              <div>
                <strong>{room.discussion.length}</strong>
                <span>Threads</span>
              </div>
              <div>
                <strong>{room.discussion.reduce((count, entry) => count + (entry.replies?.length || 0), 0)}</strong>
                <span>Replies</span>
              </div>
              <div>
                <strong>{roomDocuments.reduce((count, document) => count + (document.collaborators?.length || 0), 0)}</strong>
                <span>Collaborators</span>
              </div>
            </div>

            <button type="button" className="room-summary-link" onClick={handleCreateDocument}>
              <IconUsers />
              <span>Start one more shared note for this room</span>
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

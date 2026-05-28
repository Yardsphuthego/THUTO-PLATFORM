import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IconArrow, IconClose, IconSave, IconUsers } from '../components/Icons';
import { createDraftDocument, loadDocuments, saveDocuments } from '../lib/mockLibraryData';
import '../styles/Editor.css';

function getInitials(name) {
  return (name || 'User')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'You', status: 'editing' },
    { id: 2, name: 'Sarah M.', status: 'viewing' },
  ]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [discussion, setDiscussion] = useState([]);
  const [discussionDraft, setDiscussionDraft] = useState('');

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
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      const allDocuments = loadDocuments();
      const numericId = Number(id);
      let currentDocument = allDocuments.find((doc) => doc.id === numericId);

      if (!currentDocument) {
        currentDocument = createDraftDocument({
          nextId: numericId || allDocuments.length + 1,
          role: parsedUser?.role,
          ownerName: parsedUser?.name,
        });
        saveDocuments([currentDocument, ...allDocuments]);
      }

      setTitle(currentDocument.title);
      setContent(currentDocument.content || '');
      setCollaborators(currentDocument.collaborators || []);
      setDiscussion(currentDocument.discussion || []);
      setDocumentInfo(currentDocument);
      setIsSaved(true);
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
  }, [id, location.pathname, navigate]);

  const buildPreview = (text) => {
    const normalized = text.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return 'No preview yet.';
    }

    return normalized.length > 112 ? `${normalized.slice(0, 109)}...` : normalized;
  };

  const persistDocument = (overrides = {}) => {
    const numericId = Number(id);
    const nextTitle = overrides.title ?? title;
    const nextContent = overrides.content ?? content;
    const nextCollaborators = overrides.collaborators ?? collaborators;
    const nextDiscussion = overrides.discussion ?? discussion;
    const updaterName = currentUser?.name || 'You';

    const currentDocuments = loadDocuments();
    const existingDocument = currentDocuments.find((doc) => doc.id === numericId);

    const nextDocument = {
      ...(existingDocument || createDraftDocument({
        nextId: numericId,
        role: currentUser?.role,
        ownerName: updaterName,
      })),
      title: nextTitle,
      content: nextContent,
      preview: buildPreview(nextContent),
      collaborators: nextCollaborators,
      discussion: nextDiscussion,
      lastModified: overrides.lastModified ?? 'Just now',
      updatedBy: updaterName,
    };

    const nextDocuments = existingDocument
      ? currentDocuments.map((doc) => (doc.id === numericId ? nextDocument : doc))
      : [nextDocument, ...currentDocuments];

    saveDocuments(nextDocuments);
    setDocumentInfo(nextDocument);
    return nextDocument;
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    persistDocument();
    setIsSaved(true);
  };

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (newCollaboratorEmail.trim()) {
      const newCollab = {
        id: collaborators.length + 1,
        name: newCollaboratorEmail.split('@')[0],
        status: 'invited',
        role: 'Contributor',
      };
      const nextCollaborators = [...collaborators, newCollab];
      setCollaborators(nextCollaborators);
      persistDocument({
        collaborators: nextCollaborators,
      });
      setNewCollaboratorEmail('');
    }
  };

  const handleAddDiscussion = () => {
    const trimmedReply = discussionDraft.trim();

    if (!trimmedReply) {
      return;
    }

    const nextDiscussion = [
      ...discussion,
      {
        id: `editor-note-${Date.now()}`,
        author: currentUser?.name || 'You',
        role: currentUser?.role === 'super-admin' ? 'Super Admin' : 'Library User',
        time: 'Just now',
        message: trimmedReply,
        replies: [],
      },
    ];

    setDiscussion(nextDiscussion);
    persistDocument({
      discussion: nextDiscussion,
    });
    setDiscussionDraft('');
  };

  const handleBackToDashboard = () => {
    const destination = location.state?.from || '/dashboard';

    if (!isSaved) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(destination);
      }
    } else {
      navigate(destination);
    }
  };

  return (
    <div className="editor-wrapper">
      {/* Editor Header */}
      <header className="editor-header">
        <button className="btn-back" onClick={handleBackToDashboard} title="Back to dashboard">
          <span className="editor-action-icon editor-action-icon--back">
            <IconArrow />
          </span>
          <span>Back</span>
        </button>

        <div className="editor-title-section">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="editor-title-input"
          />
          <span className={`save-status ${isSaved ? 'saved' : 'unsaved'}`}>
            {isSaved ? 'Saved' : 'Unsaved changes'}
          </span>
        </div>

        <div className="editor-header-actions">
          <button className="btn-save" onClick={handleSave} title="Save document">
            <span className="editor-action-icon">
              <IconSave />
            </span>
            <span>Save</span>
          </button>
          <div className="collaborators-preview">
            {collaborators.slice(0, 3).map((collab) => (
              <div key={collab.id} className="collab-avatar" title={collab.name}>
                {getInitials(collab.name)}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="collab-avatar-more" title={`+${collaborators.length - 3} more`}>
                +{collaborators.length - 3}
              </div>
            )}
          </div>
          <button className="btn-share" onClick={() => setShowShareModal(true)}>
            <span className="editor-action-icon">
              <IconUsers />
            </span>
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="editor-body">
        {/* Main Editor */}
        <div className="editor-content-area">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="editor-textarea"
            placeholder="Start typing your document... Begin with a title, then add your content."
          />
        </div>

        {/* Right Sidebar - Collaborators */}
        <aside className="editor-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Collaborators</h3>
            <div className="collaborators-list">
              {collaborators.map((collab) => (
                <div key={collab.id} className="collaborator-card">
                  <div className="collab-avatar-large">{getInitials(collab.name)}</div>
                  <div className="collab-info">
                    <p className="collab-name">{collab.name}</p>
                    <p className={`collab-status ${collab.status}`}>
                      {collab.status === 'editing' && 'Editing now'}
                      {collab.status === 'viewing' && 'Viewing'}
                      {collab.status === 'invited' && 'Invitation sent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Document Info</h3>
            <div className="doc-info">
              <p><strong>Created:</strong> {documentInfo?.createdAt || 'Today'}</p>
              <p><strong>Last edited:</strong> {documentInfo?.lastModified || 'Just now'}</p>
              <p><strong>Updated by:</strong> {documentInfo?.updatedBy || 'You'}</p>
              <p><strong>Owner:</strong> {documentInfo?.owner || 'You'}</p>
              <p><strong>Room:</strong> {documentInfo?.room || 'Shared workroom'}</p>
              <p><strong>Collaborators:</strong> {collaborators.length}</p>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Live Discussion</h3>
            <div className="editor-discussion-panel">
              <div className="editor-discussion-list">
                {discussion.map((entry) => (
                  <div className="editor-discussion-item" key={entry.id}>
                    <div className="editor-discussion-avatar">{getInitials(entry.author)}</div>
                    <div className="editor-discussion-body">
                      <div className="editor-discussion-meta">
                        <strong>{entry.author}</strong>
                        <span>{entry.role} · {entry.time}</span>
                      </div>
                      <p>{entry.message}</p>

                      {entry.replies?.length ? (
                        <div className="editor-discussion-replies">
                          {entry.replies.map((reply) => (
                            <div className="editor-discussion-reply" key={reply.id}>
                              <span className="editor-discussion-reply-label">Reply</span>
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

              <div className="editor-discussion-compose">
                <input
                  type="text"
                  value={discussionDraft}
                  onChange={(event) => setDiscussionDraft(event.target.value)}
                  placeholder="Reply to the document discussion"
                />
                <button type="button" className="btn-add-discussion" onClick={handleAddDiscussion}>
                  Reply
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Document</h2>
              <button className="btn-close" onClick={() => setShowShareModal(false)} aria-label="Close share dialog">
                <IconClose />
              </button>
            </div>

            <div className="modal-body">
              <div className="share-form">
                <label>Add people to share</label>
                <form onSubmit={handleAddCollaborator} className="add-collab-form">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  />
                  <button type="submit" className="btn-add">Add</button>
                </form>
              </div>

              <div className="current-collaborators">
                <h4>Current Collaborators</h4>
                <div className="collab-list">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="collab-row">
                      <span className="collab-row-identity">
                        <span className="collab-row-avatar">{getInitials(collab.name)}</span>
                        <span>{collab.name}</span>
                      </span>
                      <span className="collab-role">Can edit</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="share-link-section">
                <label>Share Link</label>
                <div className="share-link">
                  <input
                    type="text"
                    value={`${window.location.origin}/share/${id}`}
                    readOnly
                  />
                  <button className="btn-copy">Copy Link</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowShareModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

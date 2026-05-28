export const DOCUMENTS_STORAGE_KEY = 'thutoshareDocuments';
export const ROOMS_STORAGE_KEY = 'thutoshareRooms';

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

export const seededDocuments = [
  {
    id: 1,
    title: 'African Literature Reading Pack',
    preview: 'Shared study notes, lecture extracts, and annotated reading for this week.',
    content: `African Literature Seminar Pack

Week focus
This collection brings together the primary reading, a short archive extract, and a set of guiding notes for Friday's room discussion.

Reading sequence
1. Chinua Achebe, "Things Fall Apart" chapter selections
2. Bessie Head, "Maru" classroom extract
3. Shared archive note on narrative memory and cultural continuity

Discussion prompts
- Where does the narrator create distance, and where does the voice become intimate?
- Which passages should we pin before the seminar starts?
- Add one annotation to the shared note if a paragraph feels essential for group reading.`,
    owner: 'You',
    collaborators: [
      { id: 1, name: 'You', status: 'editing', role: 'Owner' },
      { id: 2, name: 'Sarah M.', status: 'viewing', role: 'Reader' },
      { id: 3, name: 'Dr. Mpho Dintwe', status: 'editing', role: 'Supervisor' },
      { id: 4, name: 'Library Services', status: 'viewing', role: 'Curator' },
      { id: 5, name: 'Neo T.', status: 'viewing', role: 'Classmate' },
    ],
    lastModified: '12 minutes ago',
    createdAt: 'May 21, 2026',
    updatedBy: 'Library Services',
    type: 'Reading Pack',
    visibility: 'Shared with English 301',
    room: 'Humanities Reading Room',
    image: '/Library-main-1024x576.png',
    discussion: [
      {
        id: 'doc1-note1',
        author: 'Sarah M.',
        role: 'Classmate',
        time: '6 min ago',
        message: 'I added one more note under the postcolonial section. It may help us connect Achebe and Head more clearly in the room discussion.',
        replies: [
          {
            id: 'doc1-reply1',
            author: 'You',
            role: 'Reader',
            time: '4 min ago',
            message: 'I saw it. The comparison reads much clearer now, especially around voice and memory.',
          },
        ],
      },
      {
        id: 'doc1-note2',
        author: 'Library Services',
        role: 'Campus Library',
        time: '2 min ago',
        message: 'The archive extract has been pinned to the pack so everyone enters the seminar with the same background note.',
        replies: [],
      },
    ],
  },
  {
    id: 2,
    title: 'Research Methods Project Outline',
    preview: 'Draft structure for the group methodology paper and review comments.',
    content: `Research Methods Project Outline

Purpose
This document tracks the structure for the methodology chapter and the supervisor notes attached to each section.

Current structure
- Research problem and framing
- Sampling strategy
- Data collection tools
- Ethical considerations

Open revision work
1. Tighten the explanation around participant selection.
2. Add one short paragraph on data handling and storage.
3. Reply to supervisor notes before tomorrow morning so the group can move into drafting.`,
    owner: 'You',
    collaborators: [
      { id: 1, name: 'You', status: 'editing', role: 'Owner' },
      { id: 2, name: 'Dr. Mpho Dintwe', status: 'editing', role: 'Supervisor' },
      { id: 3, name: 'Kagiso Molefe', status: 'viewing', role: 'Research Partner' },
    ],
    lastModified: 'Yesterday',
    createdAt: 'May 20, 2026',
    updatedBy: 'Dr. Mpho Dintwe',
    type: 'Document',
    visibility: 'Private workspace',
    room: 'Research Support Hub',
    image: '/Document.jpeg',
    discussion: [
      {
        id: 'doc2-note1',
        author: 'Dr. Mpho Dintwe',
        role: 'Research Supervisor',
        time: '1 hr ago',
        message: 'Please revise the participant selection paragraph. It still reads too broadly for the sample you described last week.',
        replies: [
          {
            id: 'doc2-reply1',
            author: 'You',
            role: 'Reader',
            time: '42 min ago',
            message: 'Working on that now. I am narrowing the sample description and linking it to the field notes.',
          },
          {
            id: 'doc2-reply2',
            author: 'Kagiso Molefe',
            role: 'Research Partner',
            time: '18 min ago',
            message: 'I can also update the ethics subsection once the sample note is settled.',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Faculty Resource Archive',
    preview: 'Department handbooks, planning files, and pinned internal references.',
    content: `Faculty Resource Archive

Archive summary
This internal archive stores handbooks, faculty planning notes, and pinned teaching references for staff access.

Current folders
- Department handbooks
- Annual planning packs
- Internal meeting references
- Shared policy drafts

Access
This archive is visible to staff and library services. Sensitive files remain restricted behind role permissions.`,
    owner: 'Library Services',
    collaborators: [
      { id: 1, name: 'Library Services', status: 'editing', role: 'Curator' },
      { id: 2, name: 'Faculty Office', status: 'viewing', role: 'Staff' },
      { id: 3, name: 'Records Team', status: 'viewing', role: 'Records' },
      { id: 4, name: 'ICT Support', status: 'viewing', role: 'Support' },
    ],
    lastModified: '2 days ago',
    createdAt: 'May 18, 2026',
    updatedBy: 'Records Team',
    type: 'Archive',
    visibility: 'Shared with staff',
    room: 'Faculty Resource Archive',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
    discussion: [
      {
        id: 'doc3-note1',
        author: 'Records Team',
        role: 'Records',
        time: '2 days ago',
        message: 'The planning folder now has the revised retention note attached to it.',
        replies: [],
      },
    ],
  },
  {
    id: 4,
    title: 'Digital Preservation Notes',
    preview: 'Working notes on cataloguing standards and long-term preservation steps.',
    content: `Digital Preservation Notes

Objective
Capture the steps needed for cataloguing, describing, and preserving restricted materials in the preservation collection.

Active notes
- Storage checks should happen before the Friday access slot.
- Add a shared list of naming rules for incoming scans.
- Keep one pinned note with the approved intake checklist.

Room coordination
Archive requests and preservation updates should continue through the board so access decisions stay visible to the right people.`,
    owner: 'You',
    collaborators: [
      { id: 1, name: 'You', status: 'editing', role: 'Owner' },
      { id: 2, name: 'Archive Preservation Team', status: 'viewing', role: 'Preservation' },
    ],
    lastModified: '4 days ago',
    createdAt: 'May 17, 2026',
    updatedBy: 'Archive Preservation Team',
    type: 'Notebook',
    visibility: 'Shared with records team',
    room: 'Archive Requests Board',
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
    discussion: [
      {
        id: 'doc4-note1',
        author: 'Archive Preservation Team',
        role: 'Preservation',
        time: 'Today',
        message: 'Please keep the intake checklist pinned before the Friday access slot so the visiting group can prepare correctly.',
        replies: [
          {
            id: 'doc4-reply1',
            author: 'You',
            role: 'Reader',
            time: '14 min ago',
            message: 'Pinned now. I also added the naming rule note beside it.',
          },
        ],
      },
    ],
  },
];

export function slugifyRoomName(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const seededRooms = [
  {
    slug: 'humanities-reading-room',
    title: 'Humanities Reading Room',
    subtitle: 'Weekly literature reading, annotations, and seminar preparation.',
    description:
      'A calmer shared reading space for weekly literature packs, margin notes, archive extracts, and seminar replies before class begins.',
    members: 48,
    onlineNow: 12,
    nextSession: 'Today · 14:00 seminar discussion',
    image: '/Library-main-1024x576.png',
    moderators: ['Library Services', 'Dr. Mpho Dintwe'],
    guidelines: [
      'Pin one key passage before the seminar starts.',
      'Keep replies tied to the reading or shared annotations.',
      'Use linked documents for longer notes and group summaries.',
    ],
    highlights: ['English 301', 'Discussion Guide', 'Archive Extract'],
    discussion: [
      {
        id: 'room-humanities-1',
        author: 'Library Services',
        role: 'Campus Library',
        time: '8 min ago',
        message:
          'The annotated reading pack is live now. Please add one reply with the passage you want to bring into today’s conversation.',
        linkedDocId: 1,
        replies: [
          {
            id: 'room-humanities-1-reply-1',
            author: 'Sarah M.',
            role: 'Classmate',
            time: '5 min ago',
            message: 'I marked the final Achebe passage. It feels like the strongest entry point for voice and memory.',
          },
          {
            id: 'room-humanities-1-reply-2',
            author: 'You',
            role: 'Reader',
            time: '3 min ago',
            message: 'I added a second note there as well. It connects cleanly with the archive extract.',
          },
        ],
      },
      {
        id: 'room-humanities-2',
        author: 'Neo T.',
        role: 'Classmate',
        time: '26 min ago',
        message:
          'Can we keep the seminar summary in one shared document this week? The last one made it easier to review after class.',
        linkedDocId: 1,
        replies: [
          {
            id: 'room-humanities-2-reply-1',
            author: 'Library Services',
            role: 'Campus Library',
            time: '14 min ago',
            message: 'Yes. Keep using the reading pack thread and we will pin the final summary after the room closes.',
          },
        ],
      },
    ],
  },
  {
    slug: 'research-support-hub',
    title: 'Research Support Hub',
    subtitle: 'Supervisor feedback, shared methodology drafts, and project coordination.',
    description:
      'A working collaboration room for project teams, supervisor feedback, research methods drafts, and the small decisions that keep a paper moving.',
    members: 12,
    onlineNow: 5,
    nextSession: 'Tomorrow · 09:00 feedback window',
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
    moderators: ['Dr. Mpho Dintwe', 'Research Office'],
    guidelines: [
      'Reply directly to the thread that needs revision.',
      'Move longer edits into the linked project document.',
      'Flag urgent supervisor notes before the morning review.',
    ],
    highlights: ['Supervisor Note', 'Methods Draft', 'Group Review'],
    discussion: [
      {
        id: 'room-research-1',
        author: 'Dr. Mpho Dintwe',
        role: 'Research Supervisor',
        time: '1 hr ago',
        message:
          'Please narrow the participant selection paragraph before tomorrow morning. I linked the current outline here so everyone can answer in one thread.',
        linkedDocId: 2,
        replies: [
          {
            id: 'room-research-1-reply-1',
            author: 'Kagiso Molefe',
            role: 'Research Partner',
            time: '44 min ago',
            message: 'I will revise the ethics note once the sample language is settled.',
          },
          {
            id: 'room-research-1-reply-2',
            author: 'You',
            role: 'Reader',
            time: '17 min ago',
            message: 'I am updating the sample explanation now and will push the revision back into the document shortly.',
          },
        ],
      },
      {
        id: 'room-research-2',
        author: 'Research Office',
        role: 'Support Desk',
        time: 'Yesterday',
        message:
          'Citation clinic hours were extended for this week. Use this room if your team needs one final formatting check.',
        replies: [],
      },
    ],
  },
  {
    slug: 'archive-requests-board',
    title: 'Archive Requests Board',
    subtitle: 'Controlled access updates, preservation notes, and visit coordination.',
    description:
      'A protected room for access requests, intake checklists, preservation guidance, and any reply chain that needs to stay visible before archive visits.',
    members: 8,
    onlineNow: 3,
    nextSession: 'Friday · 11:30 access slot',
    image: '/1_iNcGk0ueRoQTfc6KiT7K5A.jpg',
    moderators: ['Archive Preservation Team', 'Records Team'],
    guidelines: [
      'Keep access requests attached to the right preservation thread.',
      'Use pinned notes for naming rules and intake steps.',
      'Move formal summaries into linked preservation documents.',
    ],
    highlights: ['Controlled Access', 'Preservation', 'Visit Checklist'],
    discussion: [
      {
        id: 'room-archive-1',
        author: 'Archive Preservation Team',
        role: 'Preservation',
        time: 'Today',
        message:
          'Three visit slots are open this week. Please reply here if your group needs the intake checklist before Friday.',
        linkedDocId: 4,
        replies: [
          {
            id: 'room-archive-1-reply-1',
            author: 'You',
            role: 'Reader',
            time: '14 min ago',
            message: 'I have the checklist now. I also added the naming rule note for our scan batch.',
          },
        ],
      },
      {
        id: 'room-archive-2',
        author: 'Records Team',
        role: 'Records',
        time: 'Yesterday',
        message: 'Restricted file requests should stay in this board so approval history remains visible to the preservation team.',
        replies: [],
      },
    ],
  },
  {
    slug: 'faculty-resource-archive',
    title: 'Faculty Resource Archive',
    subtitle: 'Internal references, planning packs, and staff-facing archive updates.',
    description:
      'A quieter internal archive room for staff-facing policies, planning files, and controlled references that need lightweight conversation around them.',
    members: 16,
    onlineNow: 4,
    nextSession: 'Monday · 10:00 archive review',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
    moderators: ['Library Services', 'Faculty Office'],
    guidelines: [
      'Keep internal planning notes in linked archive documents.',
      'Use this room for access changes and metadata reminders.',
      'Pin only the latest policy reference for each topic.',
    ],
    highlights: ['Staff Access', 'Policy Drafts', 'Archive Notes'],
    discussion: [
      {
        id: 'room-faculty-1',
        author: 'Records Team',
        role: 'Records',
        time: '2 days ago',
        message: 'The revised retention guidance is now attached to the faculty archive pack. Please confirm if any older planning files still need migration.',
        linkedDocId: 3,
        replies: [],
      },
    ],
  },
  {
    slug: 'public-policy-reading-circle',
    title: 'Public Policy Reading Circle',
    subtitle: 'A lighter weekly room built around civic texts and guided notes.',
    description:
      'An open reading room for slower policy discussions, public-sector reading notes, and shared reflection after each meeting.',
    members: 22,
    onlineNow: 6,
    nextSession: 'Thursday · 16:00 circle session',
    image: '/connectivity_displays__er91a9b94oeq_large.jpg',
    moderators: ['Community Library'],
    guidelines: [
      'Bring one reading insight into the main thread.',
      'Save longer summaries in linked documents.',
      'Keep new volunteers inside the welcome thread.',
    ],
    highlights: ['Public Reading', 'Weekly Circle', 'Open Notes'],
    discussion: [
      {
        id: 'room-policy-1',
        author: 'Community Library',
        role: 'Coordinator',
        time: 'Today',
        message: 'This week’s circle will focus on access, trust, and public institutions. Add one source you would like the group to see before Thursday.',
        replies: [],
      },
    ],
  },
  {
    slug: 'digital-scholarship-lab',
    title: 'Digital Scholarship Lab',
    subtitle: 'Project coordination, annotated papers, and shared working references.',
    description:
      'A more active room for teams building shared papers, digital collections, and annotation-heavy research outputs together.',
    members: 9,
    onlineNow: 4,
    nextSession: 'Wednesday · 13:00 lab review',
    image: '/vacant-modern-workspace-with-computers_482257-127194.avif',
    moderators: ['Research Office'],
    guidelines: [
      'Keep active project decisions in the thread.',
      'Attach documents whenever the discussion becomes longer than one pass.',
      'Use replies to keep reviews close to the original note.',
    ],
    highlights: ['Working Papers', 'Annotation', 'Shared Review'],
    discussion: [
      {
        id: 'room-lab-1',
        author: 'Research Office',
        role: 'Support Desk',
        time: '1 hr ago',
        message: 'The shared paper template is ready for the next lab review. Add any requests for citation or annotation support here.',
        replies: [],
      },
    ],
  },
  {
    slug: 'community-reading-programme',
    title: 'Community Reading Programme',
    subtitle: 'Volunteer reading support, outreach notes, and public-facing coordination.',
    description:
      'A community room for volunteer coordination, outreach packs, and softer discussion around reading support outside the campus setting.',
    members: 18,
    onlineNow: 7,
    nextSession: 'Saturday · 09:30 volunteer session',
    image: '/Library-main-1024x576.png',
    moderators: ['Volunteer Desk'],
    guidelines: [
      'Keep volunteer updates short and easy to scan.',
      'Use linked notes for outreach planning.',
      'Move confirmed schedules into pinned summaries.',
    ],
    highlights: ['Volunteers', 'Outreach', 'Reading Support'],
    discussion: [
      {
        id: 'room-community-1',
        author: 'Volunteer Desk',
        role: 'Coordinator',
        time: 'Today',
        message: 'We opened two extra reading support slots this weekend. Reply here if you can cover one of them.',
        replies: [],
      },
    ],
  },
];

export function loadDocuments() {
  if (typeof window === 'undefined') {
    return cloneValue(seededDocuments);
  }

  const rawValue = window.localStorage.getItem(DOCUMENTS_STORAGE_KEY);

  if (!rawValue) {
    window.localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(seededDocuments));
    return cloneValue(seededDocuments);
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (Array.isArray(parsedValue) && parsedValue.length) {
      return parsedValue;
    }
  } catch {}

  window.localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(seededDocuments));
  return cloneValue(seededDocuments);
}

export function saveDocuments(documents) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
  }

  return documents;
}

export function loadRooms() {
  if (typeof window === 'undefined') {
    return cloneValue(seededRooms);
  }

  const rawValue = window.localStorage.getItem(ROOMS_STORAGE_KEY);

  if (!rawValue) {
    window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(seededRooms));
    return cloneValue(seededRooms);
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (Array.isArray(parsedValue) && parsedValue.length) {
      return parsedValue;
    }
  } catch {}

  window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(seededRooms));
  return cloneValue(seededRooms);
}

export function saveRooms(rooms) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
  }

  return rooms;
}

export function createDraftDocument({ nextId, role, ownerName }) {
  const displayName = ownerName || 'You';
  const isAdmin = role === 'super-admin';

  return {
    id: nextId,
    title: isAdmin ? 'Untitled Admin Note' : 'Untitled Document',
    preview: isAdmin
      ? 'Start a new operations note, review summary, or governance memo.'
      : 'Start shaping a new collection note or shared document.',
    content: isAdmin
      ? `Untitled Admin Note

Purpose
Capture a new review summary, governance note, or collection action point.

Next step
Add the operational detail here and share it with the right team.`
      : `Untitled Document

Start writing
Shape the first draft here, add a shared note, or prepare a room update for collaborators.

Next step
Use the discussion panel to collect replies while the document grows.`,
    owner: 'You',
    collaborators: [
      { id: 1, name: displayName, status: 'editing', role: 'Owner' },
    ],
    lastModified: 'Just now',
    createdAt: 'Today',
    updatedBy: displayName,
    type: isAdmin ? 'Admin Note' : 'Document',
    visibility: isAdmin ? 'Operations workspace' : 'Private workspace',
    room: isAdmin ? 'Operations board' : 'Shared workroom',
    image: '/Document.jpeg',
    discussion: [
      {
        id: `doc-${nextId}-note-1`,
        author: displayName,
        role: isAdmin ? 'Super Admin' : 'Reader',
        time: 'Just now',
        message: isAdmin
          ? 'Started a new operations note. Add the first instruction or decision here.'
          : 'Started a new shared document. Add one reply here when collaborators join in.',
        replies: [],
      },
    ],
  };
}

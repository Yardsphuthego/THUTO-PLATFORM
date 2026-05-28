# THUTOSHARE - Collaborative Document Sharing Platform

A modern web application for sharing, editing, and collaborating on documents in real-time.

## Project Structure

```
├── Backend/          # Node.js Express server
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── models/       # Data models
│   ├── middleware/   # Custom middleware
│   ├── server.js     # Main server file
│   └── .env          # Environment variables
│
└── Frontend/         # React application
    ├── src/
    │   ├── pages/    # Page components (Login, Dashboard, Editor)
    │   ├── components/  # Reusable components (Header, Sidebar)
    │   ├── services/ # API calls
    │   ├── styles/   # Component styles
    │   ├── App.jsx   # Main app component
    │   └── main.jsx  # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

#### Backend Setup
```bash
cd Backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

#### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Documents
- `POST /api/documents` - Create a new document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/collaborators` - Add collaborator to document

## Features

- **User Authentication** - Login and signup system
- **Document Management** - Create, read, update, and delete documents
- **Collaboration** - Share documents with other users
- **Real-time Editor** - Edit documents with a clean, intuitive interface
- **Dashboard** - View recent documents and quick actions

## Technology Stack

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **CORS** - Handle cross-origin requests
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **CSS3** - Styling

## Pages

### Login
- User email/password authentication
- Beautiful gradient background
- Sign up link for new users

### Dashboard
- View recent documents
- Quick action buttons
- Document cards with previews

### Editor
- Full-screen document editor
- Collaborators panel
- Title and content editing
- Save and share buttons

## Next Steps

1. **Implement Authentication** - Add JWT tokens and session management
2. **Database Integration** - Connect MongoDB/PostgreSQL
3. **Real-time Collaboration** - Add WebSocket support for live editing
4. **User Profiles** - Profile pages and user management
5. **Document History** - Version control and history tracking
6. **Notifications** - Email and in-app notifications

## Project Features to Add

- [ ] User authentication with JWT
- [ ] Database persistence
- [ ] Real-time collaboration with WebSockets
- [ ] Document versioning
- [ ] Comment system
- [ ] File export (PDF, Word)
- [ ] Image and media support
- [ ] Search functionality
- [ ] Share with permissions
- [ ] Activity feed

## Development

### Running both servers simultaneously
```bash
# Terminal 1 - Backend
cd Backend && npm start

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## Contributing
1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License
ISC

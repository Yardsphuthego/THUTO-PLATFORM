# Thuto BAC - Frontend

React TypeScript frontend for the Thuto BAC Digital Voting Platform.

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- User authentication (login/register)
- View available elections
- Cast votes
- Real-time results
- Responsive design

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── contexts/        # React context for state management
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static files
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8000/api`.

Ensure the backend is running before starting the frontend development server.

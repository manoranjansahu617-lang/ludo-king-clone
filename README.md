# Ludo King Clone

A multiplayer Ludo board game app with Flutter frontend and Node.js backend, featuring a secret admin panel to pre-select winners.

## Features

- 🎮 Real-time multiplayer gameplay (2-4 players)
- 📱 Cross-platform support (iOS, Android, Web)
- 🎲 Authentic Ludo game mechanics
- 🔐 Secret admin feature to preset winners
- 💬 In-game chat
- 🏆 Leaderboards and match history
- 🎨 Beautiful UI inspired by Ludo King

## Project Structure

```
.
├── frontend/              # Flutter mobile app
├── backend/               # Node.js Express server
├── database/              # Database schemas
└── docs/                  # Documentation
```

## Tech Stack

### Frontend
- Flutter (Dart)
- Provider (State Management)
- Socket.IO client

### Backend
- Node.js with Express
- Socket.IO (Real-time communication)
- MongoDB (Database)
- JWT (Authentication)

## Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend Setup

```bash
cd frontend
flutter pub get
flutter run
```

## Environment Variables

See `.env.example` in the backend folder for required environment variables.

## API Documentation

See `docs/API.md` for detailed API endpoints.

## License

MIT License
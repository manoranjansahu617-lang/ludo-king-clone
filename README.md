# 🎲 Ludo King Clone

A **multiplayer Ludo board game** built with **Node.js + Socket.IO** backend and **Flutter** frontend. Experience real-time competitive gaming with friends!

## ✨ Features

✅ **Real-time Multiplayer** - Play with up to 4 players simultaneously  
✅ **WebSocket Communication** - Instant game state updates via Socket.IO  
✅ **User Authentication** - Secure login/register with JWT  
✅ **Leaderboard System** - Track wins, losses, and ratings  
✅ **Game History** - View past games and statistics  
✅ **Multiple Game Modes** - Classic, Quick, and Team modes  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Admin Dashboard** - Manage games and users (Secret features)  

## 🏗️ Project Structure

```
ludo-king-clone/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── sockets/         # Socket.IO handlers
│   │   ├── middleware/      # Auth, validation
│   │   ├── services/        # Business logic
│   │   └── server.js        # Main entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── lib/
│   │   ├── main.dart        # App entry point
│   │   ├── screens/         # UI screens
│   │   ├── providers/       # State management
│   │   ├── models/          # Data models
│   │   ├── services/        # API & Socket services
│   │   └── widgets/         # Reusable components
│   ├── pubspec.yaml
│   └── .env
│
├── database/
│   └── schema.sql           # MongoDB schema
│
├── API_DOCUMENTATION.md     # Full API reference
├── SETUP.md                 # Installation guide
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 14.0
- **MongoDB** (local or Atlas)
- **Flutter** >= 3.0
- **Dart** SDK

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ludo-king
JWT_SECRET=your-secret-key
ADMIN_SECRET_KEY=your-admin-key

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend
flutter pub get

# Run on emulator
flutter run

# Build APK
flutter build apk
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Games
- `GET /api/game/:gameId` - Get game status
- `GET /api/game/history/:userId` - Get user's game history

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/user/:userId` - User statistics

### Admin (Secret)
- `POST /api/admin/set-winner` - Preset game winner
- `GET /api/admin/audit-logs` - View admin actions
- `POST /api/admin/modify-game` - Modify game state

## 🎮 WebSocket Events

### Emit
- `createGame` - Create a new game
- `joinGame` - Join an existing game
- `rollDice` - Roll the dice
- `movePiece` - Move a game piece
- `gameFinished` - End the game

### Listen
- `gameCreated` - Game successfully created
- `playerJoined` - Player joined the game
- `diceRolled` - Dice roll result
- `pieceMoved` - Piece movement update
- `gameCompleted` - Game ended

## 🔐 Security Features

🔒 **JWT Authentication** - Secure token-based auth  
🔒 **Password Hashing** - Bcrypt for password security  
🔒 **CORS Protection** - Restricted cross-origin requests  
🔒 **Audit Logging** - Track all admin actions  
🔒 **Secret Admin Endpoints** - Hidden admin features with secret keys  

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  displayName: String,
  wins: Number,
  losses: Number,
  totalGames: Number,
  rating: Number,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Games Collection
```javascript
{
  gameId: String (unique),
  status: String (waiting|in_progress|completed|cancelled),
  players: Array,
  gameMode: String,
  winner: ObjectId,
  predeterminedWinner: ObjectId,
  isRigged: Boolean,
  moves: Array,
  diceHistory: Array,
  createdAt: Date,
  completedAt: Date
}
```

## 🎨 UI Screenshots

- **Splash Screen** - Loading animation
- **Login/Register** - User authentication
- **Home Screen** - Game modes and statistics
- **Game Board** - Real-time multiplayer gameplay
- **Leaderboard** - Player rankings
- **Stats Screen** - Personal statistics

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Lint code
npm run lint
```

## 🐛 Known Issues & Limitations

- Maximum 4 players per game
- Mobile-only for Flutter app (no web build currently)
- Dice rolls follow standard 1-6 range
- Chat feature coming soon
- Replay system not yet implemented

## 📈 Future Enhancements

- [ ] In-game chat system
- [ ] Customizable avatars
- [ ] Game replays and analysis
- [ ] Daily challenges
- [ ] Social features (friend lists)
- [ ] Push notifications
- [ ] Offline mode
- [ ] AI opponents
- [ ] Trading cards system
- [ ] Seasonal tournaments

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### MongoDB connection error
```bash
# Ensure MongoDB is running
mongod

# Or check MongoDB service
sudo systemctl status mongod
```

### Flutter build issues
```bash
flutter clean
flutter pub get
flutter run
```

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Setup Guide](./SETUP.md) - Detailed installation steps
- [Architecture](./docs/ARCHITECTURE.md) - System design (coming soon)

## 👥 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Manoranjan Sahu**
- GitHub: [@manoranjansahu617-lang](https://github.com/manoranjansahu617-lang)
- Email: manoranjansahu617@gmail.com

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Flutter team for amazing mobile framework
- MongoDB for flexible database
- Express.js for robust backend framework

## 📞 Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Contact via email
- Check the documentation first

---

**Happy Gaming! 🎮**

*Made with ❤️ by Manoranjan Sahu*

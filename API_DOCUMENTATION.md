# Ludo King Clone - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All authenticated endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com"
  }
}
```

### Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com"
  }
}
```

---

## 🎮 Game Endpoints

### Get Game Status
**GET** `/api/game/:gameId`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "in_progress",
  "players": [
    {
      "userId": "507f1f77bcf86cd799439012",
      "username": "player1",
      "color": "red",
      "position": 15,
      "pieces": [
        { "id": 1, "position": 15 },
        { "id": 2, "position": 8 },
        { "id": 3, "position": 0 },
        { "id": 4, "position": 0 }
      ]
    }
  ],
  "gameMode": "classic",
  "moves": [],
  "diceHistory": [3, 5, 2],
  "createdAt": "2026-07-06T10:00:00Z"
}
```

### Get Game History
**GET** `/api/game/history/:userId`

**Response (200):**
```json
[
  {
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "winner": "507f1f77bcf86cd799439012",
    "winnerName": "player1",
    "completedAt": "2026-07-06T10:30:00Z",
    "duration": 1800
  }
]
```

---

## 🏆 Leaderboard Endpoints

### Get Global Leaderboard
**GET** `/api/leaderboard/global?limit=100`

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "topplayer",
    "displayName": "Top Player",
    "wins": 45,
    "losses": 5,
    "rating": 1850,
    "totalGames": 50,
    "avatar": "https://..."
  }
]
```

### Get User Stats
**GET** `/api/leaderboard/user/:userId`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "player123",
  "displayName": "Player One",
  "wins": 15,
  "losses": 8,
  "rating": 1200,
  "totalGames": 23,
  "avatar": "https://...",
  "winRate": "65.22",
  "createdAt": "2026-06-01T00:00:00Z"
}
```

---

## 🔒 Admin Endpoints (SECRET)

### ⚠️ Set Winner (Predetermine Game Outcome)
**POST** `/api/admin/set-winner`

**Headers:**
```
X-Admin-Secret: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "winnerId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "message": "Winner preset successfully",
  "game": {
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "predeterminedWinner": "507f1f77bcf86cd799439011",
    "isRigged": true
  }
}
```

**Audit Log Entry:**
- Action: `WINNER_PRESET`
- Admin can view who preset the winner and when

---

### ⚠️ Get Audit Logs
**GET** `/api/admin/audit-logs`

**Headers:**
```
X-Admin-Secret: your-admin-secret-key
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "action": "WINNER_PRESET",
    "adminId": "507f1f77bcf86cd799439001",
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "targetUserId": "507f1f77bcf86cd799439011",
    "details": { "message": "Winner preset by admin" },
    "ipAddress": "192.168.1.100",
    "timestamp": "2026-07-06T10:15:00Z"
  }
]
```

---

### ⚠️ Modify Game
**POST** `/api/admin/modify-game`

**Headers:**
```
X-Admin-Secret: your-admin-secret-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "cancel",
  "data": { "reason": "Suspicious activity detected" }
}
```

**Actions Available:**
- `cancel` - Cancel the game
- `reset` - Reset game moves and dice history

**Response (200):**
```json
{
  "message": "Game cancel successfully",
  "game": {
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "cancelled"
  }
}
```

---

## 🔌 WebSocket Events (Socket.IO)

### Emit Events

#### Create Game
```javascript
socket.emit('createGame', {
  userId: 'user_id',
  username: 'player_name',
  gameMode: 'classic' // or 'quick', 'team'
});
```

#### Join Game
```javascript
socket.emit('joinGame', {
  gameId: 'game_id',
  userId: 'user_id',
  username: 'player_name'
});
```

#### Roll Dice
```javascript
socket.emit('rollDice', {
  gameId: 'game_id',
  playerId: 'player_id',
  username: 'player_name'
});
```

#### Move Piece
```javascript
socket.emit('movePiece', {
  gameId: 'game_id',
  playerId: 'player_id',
  pieceId: 1,
  newPosition: 15,
  diceValue: 5
});
```

#### Finish Game
```javascript
socket.emit('gameFinished', {
  gameId: 'game_id',
  winnerId: 'winner_id',
  winnerName: 'winner_name'
});
```

### Listen Events

#### Game Created
```javascript
socket.on('gameCreated', (data) => {
  console.log(data.gameId); // New game ID
  console.log(data.game); // Game object
});
```

#### Player Joined
```javascript
socket.on('playerJoined', (data) => {
  console.log(data.game); // Updated game object
  console.log(data.username); // New player name
});
```

#### Dice Rolled
```javascript
socket.on('diceRolled', (data) => {
  console.log(data.diceValue); // Dice roll value (1-6)
  console.log(data.username); // Who rolled
});
```

#### Piece Moved
```javascript
socket.on('pieceMoved', (data) => {
  console.log(data.playerId);
  console.log(data.pieceId);
  console.log(data.newPosition);
});
```

#### Game Completed
```javascript
socket.on('gameCompleted', (data) => {
  console.log(data.winnerId);
  console.log(data.winnerName);
  console.log(data.game); // Final game state
});
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Username must be at least 3 characters",
      "param": "username"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Game not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error message details"
}
```

---

## Environment Variables

```bash
# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ludo-king
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ADMIN_SECRET_KEY=your-admin-secret-key
SOCKET_CORS_ORIGIN=*

# Frontend
API_BASE_URL=http://localhost:5000
SOCKET_URL=http://localhost:5000
```

---

## 🎯 Key Features

✅ User authentication (Register/Login)
✅ Real-time multiplayer games via WebSocket
✅ Game state management
✅ Leaderboard system
✅ Audit logging
✅ **SECRET: Game outcome manipulation (Admin only)**
✅ **SECRET: Dice roll manipulation when winner is preset**
✅ **SECRET: Audit trail of admin actions**

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Tokens expire after 7 days by default
- Dice rolls are random (1-6) unless a winner is preset
- When a winner is preset, dice rolls are biased in their favor
- All admin actions are logged and auditable

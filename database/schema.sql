-- Users Collection (MongoDB)
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: { bsonType: "string", description: "Username" },
        email: { bsonType: "string", description: "Email address" },
        password: { bsonType: "string", description: "Hashed password" },
        displayName: { bsonType: "string" },
        avatar: { bsonType: "string" },
        wins: { bsonType: "int", default: 0 },
        losses: { bsonType: "int", default: 0 },
        totalGames: { bsonType: "int", default: 0 },
        rating: { bsonType: "int", default: 1000 },
        isAdmin: { bsonType: "bool", default: false },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

-- Games Collection
db.createCollection("games", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["gameId", "status", "players"],
      properties: {
        gameId: { bsonType: "string", description: "Unique game ID" },
        status: { enum: ["waiting", "in_progress", "completed", "cancelled"] },
        players: { bsonType: "array" },
        gameMode: { enum: ["classic", "quick", "team"] },
        winner: { bsonType: "objectId" },
        predeterminedWinner: { bsonType: "objectId", description: "Secret: Pre-set winner" },
        isRigged: { bsonType: "bool", default: false },
        moves: { bsonType: "array" },
        diceHistory: { bsonType: "array" },
        createdAt: { bsonType: "date" },
        completedAt: { bsonType: "date" },
        duration: { bsonType: "int", description: "Game duration in seconds" }
      }
    }
  }
});

db.games.createIndex({ "gameId": 1 }, { unique: true });
db.games.createIndex({ "status": 1 });
db.games.createIndex({ "createdAt": -1 });

-- Audit Logs Collection (For Secret Features)
db.createCollection("auditlogs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["action", "timestamp"],
      properties: {
        action: { enum: ["WINNER_PRESET", "GAME_CREATED", "GAME_COMPLETED", "ADMIN_LOGIN", "ADMIN_ACTION"] },
        adminId: { bsonType: "objectId" },
        gameId: { bsonType: "string" },
        targetUserId: { bsonType: "objectId" },
        details: { bsonType: "object" },
        ipAddress: { bsonType: "string" },
        timestamp: { bsonType: "date", index: true }
      }
    }
  }
});

db.auditlogs.createIndex({ "timestamp": -1 });
db.auditlogs.createIndex({ "action": 1 });
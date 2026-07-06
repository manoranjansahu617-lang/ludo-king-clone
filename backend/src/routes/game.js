const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get game status
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get game history
router.get('/history/:userId', async (req, res) => {
  try {
    const games = await Game.find({
      'players.userId': req.params.userId,
      status: 'completed'
    }).sort({ completedAt: -1 }).limit(20);
    
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
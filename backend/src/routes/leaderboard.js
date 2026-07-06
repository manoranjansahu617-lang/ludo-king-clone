const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const leaderboard = await User.find()
      .sort({ rating: -1 })
      .limit(limit)
      .select('username displayName wins losses rating totalGames avatar');
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user stats
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username displayName wins losses rating totalGames avatar createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const winRate = user.totalGames > 0 
      ? ((user.wins / user.totalGames) * 100).toFixed(2) 
      : 0;

    res.json({
      ...user.toObject(),
      winRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
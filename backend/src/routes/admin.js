const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const AuditLog = require('../models/AuditLog');
const { body, validationResult } = require('express-validator');

// Middleware to verify admin secret
const verifyAdminSecret = (req, res, next) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

// SECRET: Pre-set winner for a game
router.post('/set-winner', verifyAdminSecret, [
  body('gameId').notEmpty(),
  body('winnerId').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { gameId, winnerId } = req.body;

    // Find and update game
    const game = await Game.findOneAndUpdate(
      { gameId },
      {
        predeterminedWinner: winnerId,
        isRigged: true
      },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Log this action
    await AuditLog.create({
      action: 'WINNER_PRESET',
      gameId,
      targetUserId: winnerId,
      details: { message: 'Winner preset by admin' },
      ipAddress: req.ip,
      timestamp: new Date()
    });

    res.json({
      message: 'Winner preset successfully',
      game
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SECRET: Get audit logs (admin only)
router.get('/audit-logs', verifyAdminSecret, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SECRET: Cancel/Modify game (admin only)
router.post('/modify-game', verifyAdminSecret, async (req, res) => {
  try {
    const { gameId, action, data } = req.body;

    let updateData = {};
    
    if (action === 'cancel') {
      updateData = { status: 'cancelled' };
    } else if (action === 'reset') {
      updateData = { status: 'in_progress', moves: [], diceHistory: [] };
    }

    const game = await Game.findOneAndUpdate(
      { gameId },
      updateData,
      { new: true }
    );

    await AuditLog.create({
      action: 'ADMIN_ACTION',
      gameId,
      details: { action, data },
      ipAddress: req.ip
    });

    res.json({ message: `Game ${action} successfully`, game });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
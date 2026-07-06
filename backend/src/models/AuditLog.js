const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['WINNER_PRESET', 'GAME_CREATED', 'GAME_COMPLETED', 'ADMIN_LOGIN', 'ADMIN_ACTION']
  },
  adminId: mongoose.Schema.Types.ObjectId,
  gameId: String,
  targetUserId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
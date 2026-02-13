const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  errorCode: {
    type: Number,
    required: true,
    index: true
  },
  errorMessage: {
    type: String,
    required: true
  },
  internalMessage: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    index: true
  },
  channel: {
    type: String,
    enum: ['website', 'telegram', 'whatsapp', 'system'],
    index: true
  },
  requestId: {
    type: String,
    index: true
  },
  userMessage: String,
  stackTrace: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolved: {
    type: Boolean,
    default: false
  }
});

// Index for monitoring queries
errorLogSchema.index({ timestamp: -1, errorCode: 1 });
errorLogSchema.index({ resolved: 1, timestamp: -1 });

module.exports = mongoose.model('ErrorLog', errorLogSchema);

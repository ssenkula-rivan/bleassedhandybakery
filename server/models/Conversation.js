const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    intent: String,
    emotion: String,
    confidence: Number
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  channel: {
    type: String,
    enum: ['website', 'telegram', 'whatsapp'],
    required: true,
    index: true
  },
  messages: [messageSchema],
  userProfile: {
    name: String,
    phone: String,
    preferences: mongoose.Schema.Types.Mixed,
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
conversationSchema.index({ userId: 1, channel: 1 });
conversationSchema.index({ createdAt: -1 });

// Update timestamp on save
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);

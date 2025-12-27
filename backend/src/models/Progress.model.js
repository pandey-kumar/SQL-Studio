const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be null for guest users
  },
  sessionId: {
    type: String,
    required: function() {
      return !this.userId; // Required if no userId
    }
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  sqlQuery: {
    type: String,
    default: ''
  },
  queryHistory: [{
    query: String,
    executedAt: {
      type: Date,
      default: Date.now
    },
    success: Boolean,
    executionTime: Number // in milliseconds
  }],
  hintsUsed: {
    type: Number,
    default: 0
  },
  attemptCount: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastAttempt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient lookups
progressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true, sparse: true });
progressSchema.index({ sessionId: 1, assignmentId: 1 }, { sparse: true });

// Update lastAttempt on save
progressSchema.pre('save', function(next) {
  this.lastAttempt = new Date();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);

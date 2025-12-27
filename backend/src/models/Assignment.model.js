const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  columnName: {
    type: String,
    required: true
  },
  dataType: {
    type: String,
    required: true,
    enum: ['INTEGER', 'TEXT', 'VARCHAR', 'REAL', 'DECIMAL', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'SERIAL']
  }
}, { _id: false });

const sampleTableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true
  },
  columns: [columnSchema],
  rows: {
    type: [[mongoose.Schema.Types.Mixed]], // Array of arrays for flexible row data
    default: []
  }
}, { _id: false });

const expectedOutputSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['table', 'single_value', 'column', 'count', 'row']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  category: {
    type: String,
    required: true,
    enum: ['SELECT', 'WHERE', 'JOIN', 'GROUP BY', 'SUBQUERY', 'AGGREGATE', 'ADVANCED'],
    default: 'SELECT'
  },
  question: {
    type: String,
    required: [true, 'Question is required']
  },
  description: {
    type: String,
    required: true
  },
  hints: {
    type: [String],
    default: []
  },
  sampleTables: [sampleTableSchema],
  expectedOutput: expectedOutputSchema,
  schemaName: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 10
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
assignmentSchema.index({ difficulty: 1, category: 1 });
assignmentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);

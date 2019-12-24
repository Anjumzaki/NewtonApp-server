const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GoalSchema = new Schema({
    selectedYear: {
    type: String,
    required: true
  },
  spiff: {
    type: String,
    required: true
  },
  commission: {
    type: String,
    required: true
  },
  bonus: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = goal = mongoose.model('goal', GoalSchema);
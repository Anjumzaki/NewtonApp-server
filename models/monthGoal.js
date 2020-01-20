const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const mGoalSchema = new Schema({
  selectedYear: {
    type: String,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
  month: {
    type: String,
    // required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mgoal = mongoose.model('mgoal', mGoalSchema);
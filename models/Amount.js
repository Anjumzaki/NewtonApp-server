const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AmountSchema = new Schema({
  selectedYear: {
    type: String,
    required: true
  },
  selectedMonth: {
    type: String,
    required: true
  },
  bonus: {
    type: String,
    required: true
  },
  commission: {
    type: String,
    required: true
  },
  pmdDeduction: {
    type: String,
    required: true
  }
});

module.exports = amount = mongoose.model('amount', AmountSchema);
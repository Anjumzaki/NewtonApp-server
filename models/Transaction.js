const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TransSchema = new Schema({
  soldDate: {
    type: String,
    required: true
  },
  payDate: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
  downPayment: {
    type: String,
    required: true
  },
  spiff: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  pmdDeduction: {
    type: String,
    required: true
  },
  commission: {
    type: String,
    // required: true
  },
  bonus: {
    type: String,
    required: true
  },
});

module.exports = transaction = mongoose.model('transaction', TransSchema);
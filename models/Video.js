const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VideoSchema = new Schema({
    title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  feature: {
    type: Boolean,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  }
});

module.exports = Video = mongoose.model('Video', VideoSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BlogSchema = new Schema({
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
  blogImage: {
    type: String,
    required: true
  },
  picId: String
});

module.exports = Blog = mongoose.model('Blog', BlogSchema);
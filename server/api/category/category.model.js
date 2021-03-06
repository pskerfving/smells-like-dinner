'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  rank: Number
});

module.exports = mongoose.model('Category', CategorySchema);
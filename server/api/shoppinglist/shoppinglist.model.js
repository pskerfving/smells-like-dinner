'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppinglistSchema = new Schema({
  config: { nbrDays: Number, listMode: String },
  removed: [ { ingredientid: Schema.ObjectId } ],
  extras: [ { name: String, ingredientid: Schema.ObjectId } ],
});

module.exports = mongoose.model('Shoppinglist', ShoppinglistSchema);
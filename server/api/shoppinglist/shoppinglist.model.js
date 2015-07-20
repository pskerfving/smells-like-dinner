'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppinglistSchema = new Schema({
  user_id: Schema.ObjectId,
  config: { nbrDays: Number, listMode: String },
  extras: [ { ingredientid: Schema.ObjectId } ],
  removed: [ { ingredientid: Schema.ObjectId } ],
  picked: [ { ingredientid: Schema.ObjectId} ]
});

module.exports = mongoose.model('Shoppinglist', ShoppinglistSchema);
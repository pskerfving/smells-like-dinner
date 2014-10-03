'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  name: String,
  ingredients: [ { name: String, ingredientid: Schema.ObjectId } ],
  sides: [ { name: String, ingredientid: Schema.ObjectId } ]
});

module.exports = mongoose.model('Meal', MealSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  name: String,
  ingredients: [ { name: String } ],
  sides: [ { name: String } ]
});

module.exports = mongoose.model('Meal', MealSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  name: String,
  user_id: Schema.ObjectId,
  ingredients: [ { ingredientid: { type: Schema.ObjectId, ref: 'Ingredient' } } ],
  empty: Boolean
});

module.exports = mongoose.model('Meal', MealSchema);

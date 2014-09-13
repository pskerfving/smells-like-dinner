'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
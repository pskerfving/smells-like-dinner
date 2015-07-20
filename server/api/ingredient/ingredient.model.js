'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientSchema = new Schema({
  name: String,
  category_id: Schema.ObjectId
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
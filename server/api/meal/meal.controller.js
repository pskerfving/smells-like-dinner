'use strict';

var _ = require('lodash');
var Meal = require('./meal.model');

// Get list of meals
exports.index = function(req, res) {

  console.log('Express getting the meals');

  Meal.find(function (err, meals) {
    if(err) { return handleError(res, err); }
    return res.json(200, meals);
  });
};

// Get a single meal
exports.show = function(req, res) {
  Meal.findById(req.params.id, function (err, meal) {
    if(err) { return handleError(res, err); }
    if(!meal) { return res.send(404); }
    return res.json(meal);
  });
};

// Creates a new meal in the DB.
exports.create = function(req, res) {
  console.log('CREATE');
  Meal.create(req.body, function(err, meal) {
    if(err) { return handleError(res, err); }
    console.log('meal created : ' + meal)
    return res.json(201, meal);
  });
};

// Updates an existing meal in the DB.
exports.update = function(req, res) {
  console.log('UPDATE');
  console.log(req.body);
  console.log(req.params.id);
  if(req.body._id) { delete req.body._id; }
  Meal.findById(req.params.id, function (err, meal) {
    if (err) { return handleError(res, err); }
    if(!meal) { return res.send(404); }
    var updated = _.merge(meal, req.body);
    console.log(updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, meal);
    });
  });
};

// Deletes a meal from the DB.
exports.destroy = function(req, res) {
  Meal.findById(req.params.id, function (err, meal) {
    if(err) { return handleError(res, err); }
    if(!meal) { return res.send(404); }
    meal.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
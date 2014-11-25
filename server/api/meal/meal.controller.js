'use strict';

var _ = require('lodash');
var Meal = require('./meal.model');

// Get list of meals
exports.index = function(req, res) {

  if (!req.user) {
    // Not logged in
    Meal.find({ user_id: null }, function(err, meals) {
      if(err) { return handleError(res, err); }
      console.log('RETURNING PUBLIC MEALS : ', meals);
      return res.json(200, meals);
    });
  } else {
    // User is logged in
    // Collect the friends and own meals
    var owners = [];
    owners.push(req.user._id); // Include own meals.
    // Include meals of all friends.
    for (var i = 0; i < req.user.friends_id.length; i++) {
      owners.push(req.user.friends_id[i]);
    }

    Meal.find().where('user_id').in(owners).exec(function (err, meals) {
      if(err) { return handleError(res, err); }
      console.log('RETURNING USER MEALS : ', meals);
      return res.json(200, meals);
    });
  }
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
    return res.json(201, meal);
  });
};

// Updates an existing meal in the DB.
exports.update = function(req, res) {
  console.log('storing meal - request: ', req.body);
  if(req.body._id) { delete req.body._id; }
  Meal.findById(req.params.id, function (err, meal) {
    if (err) { return handleError(res, err); }
    if(!meal) { return res.send(404); }
    var updated = _.merge(meal, req.body, function(a, b) {
      if (_.isArray(a)) {
        if (a.length > b.length) {
          // Something was removed, use what came from the client.
          return b;
        } else {
          return _.uniq(a.concat(b), function(c) {
            if (c.ingredientid) return c.ingredientid.toString();
            else return c.name;
          });
        }
      }
      return undefined;
    });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, updated);
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
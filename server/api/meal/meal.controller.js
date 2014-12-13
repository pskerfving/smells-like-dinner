'use strict';

var _ = require('lodash');
var Meal = require('./meal.model');
var Schedule = require('../schedule/schedule.model');

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
    console.log('USER : ', req.user);
    Schedule.findById(req.user.schedule_id, function(err, schedule) {
      if(err) { return handleError(res, err); }
      var schedule_meals = [];
      for (var j = 0; j < schedule.days.length; j++) {
        schedule_meals.push(schedule.days[j].mealid);
      }
      Meal.find({ $or: [ { user_id: { $in: owners } }, { _id: { $in: schedule_meals } } ] }, function (err, meals) {
        if(err) { return handleError(res, err); }
        console.log('FOUND THE MEALS : ', meals);
        // Remove all shopped-entries not related to the users current shoppinglist.
        meals.forEach(function(meal) {
          if (meal.shopped) {
            meal.shopped = meal.shopped.filter(function(item) {
              var ret = (item.shoppinglist_id.toString() === schedule.shoppinglist_id.toString());
              return ret;
            });
          }
        });
        return res.json(200, meals);
      });
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

exports.shopped = function(req, res) {
  console.log('SHOPPED');
  console.log(req.body);
  Meal.findById(req.params.id, function(err, meal) {
    if(err) { return handleError(res, err); }
    if(!meal) { return res.send(404); }
    var id = req.body.shopped[0];
    // Remove any old stuff related to this shoppinglist
    meal.shopped = meal.shopped.filter(function(item) {
      return item.shoppinglist_id.toString !== id.shoppinglist_id.toString();
    });
    meal.shopped.push(id);
    meal.save(function (err) {
      return res.json(200, meal);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

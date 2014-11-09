'use strict';

var _ = require('lodash');
var Schedule = require('./schedule.model');

// Get list of schedules
exports.index = function(req, res) {
  console.log('Express getting the schedule');
  console.log('user_id : ', req.query);
  var user_id = null;
  if (req.query.user_id) {
    user_id = req.query.user_id;
  }
  Schedule.find({ 'user_id': user_id }, function (err, schedules) {
    if(err) { return handleError(res, err); }
    return res.json(200, schedules);
  });
};

// Get a single schedule
exports.show = function(req, res) {
  Schedule.findById(req.params.id, function (err, schedule) {
    if(err) { return handleError(res, err); }
    if(!schedule) { return res.send(404); }
    return res.json(schedule);
  });
};

// Creates a new schedule in the DB.
exports.create = function(req, res) {
  Schedule.create(req.body, function(err, schedule) {
    if(err) { return handleError(res, err); }
    return res.json(201, schedule);
  });
};

// Updates an existing schedule in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Schedule.findById(req.params.id, function (err, schedule) {
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    if(!schedule) { return res.send(404); }
    var updated = _.merge(schedule, req.body, function(a, b) {
      return _.isArray(b) ? b : undefined;
    });
    // Strip trailing mealid = null before saving to db.
    while (updated.days[updated.days.length - 1].mealid === null) { updated.days.pop(); }
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, schedule);
    });
  });
};

// Deletes a schedule from the DB.
exports.destroy = function(req, res) {
  Schedule.findById(req.params.id, function (err, schedule) {
    if(err) { return handleError(res, err); }
    if(!schedule) { return res.send(404); }
    schedule.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
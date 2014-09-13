'use strict';

var _ = require('lodash');
var Schedule = require('./schedule.model');

// Get list of schedules
exports.index = function(req, res) {
  Schedule.find(function (err, schedules) {
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
    if (err) { return handleError(res, err); }
    if(!schedule) { return res.send(404); }
    var updated = _.merge(schedule, req.body);
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
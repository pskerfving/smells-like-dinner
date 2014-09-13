'use strict';

var _ = require('lodash');
var Shoppinglist = require('./shoppinglist.model');

// Get list of shoppinglists
exports.index = function(req, res) {
  Shoppinglist.find(function (err, shoppinglists) {
    if(err) { return handleError(res, err); }
    return res.json(200, shoppinglists);
  });
};

// Get a single shoppinglist
exports.show = function(req, res) {
  Shoppinglist.findById(req.params.id, function (err, shoppinglist) {
    if(err) { return handleError(res, err); }
    if(!shoppinglist) { return res.send(404); }
    return res.json(shoppinglist);
  });
};

// Creates a new shoppinglist in the DB.
exports.create = function(req, res) {
  Shoppinglist.create(req.body, function(err, shoppinglist) {
    if(err) { return handleError(res, err); }
    return res.json(201, shoppinglist);
  });
};

// Updates an existing shoppinglist in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Shoppinglist.findById(req.params.id, function (err, shoppinglist) {
    if (err) { return handleError(res, err); }
    if(!shoppinglist) { return res.send(404); }
    var updated = _.merge(shoppinglist, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, shoppinglist);
    });
  });
};

// Deletes a shoppinglist from the DB.
exports.destroy = function(req, res) {
  Shoppinglist.findById(req.params.id, function (err, shoppinglist) {
    if(err) { return handleError(res, err); }
    if(!shoppinglist) { return res.send(404); }
    shoppinglist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
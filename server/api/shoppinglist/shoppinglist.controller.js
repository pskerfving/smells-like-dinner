'use strict';

var _ = require('lodash');
var Shoppinglist = require('./shoppinglist.model');

// Get list of shoppinglists
exports.index = function(req, res) {
  var user_id = null;
  if (req.query.user_id) {
    user_id = req.query.user_id;
  }
  Shoppinglist.find({ 'user_id': user_id }, function (err, shoppinglists) {
    if(err) { return handleError(res, err); }
    console.log('returning shoppinglist. user:', user_id);
    console.log('returning shoppinglist. data:', shoppinglists);
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

// Get the shopping list that belongs to users who are not logged in.
exports.showAnonymous = function(req, res) {
  console.log('SHOPPIGNLIST ANONYMOUS');
  Shoppinglist.findOne({ user_id: null }, function (err, shoppinglist) {
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
  console.log('request: ', req.body);
  if(req.body._id) { delete req.body._id; }
  Shoppinglist.findById(req.params.id, function (err, shoppinglist) {
    if (err) { return handleError(res, err); }
    if(!shoppinglist) { return res.send(404); }
    var updated = _.merge(shoppinglist, req.body, function(a, b) {
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
    console.log('updated: ', updated);
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
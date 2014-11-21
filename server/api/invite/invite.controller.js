'use strict';

var _ = require('lodash');
var Invite = require('./invite.model');

// Get list of invites for this user
exports.index = function(req, res) {
  Invite.find({ invitee_email: req.user.email, expired: false }, function (err, invites) {
    if(err) { return handleError(res, err); }
    return res.json(200, invites);
  });
};


// Get a single invite
exports.show = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    return res.json(invite);
  });
};

// Creates a new invite in the DB.
exports.create = function(req, res) {
  // TODO: Make sure the invite is unique.
  Invite.create(req.body, function(err, invite) {
    if(err) { return handleError(res, err); }
    // TODO: Send email to the invitee.
    return res.json(201, invite);
  });
};

// Updates an existing invite in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    if (err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    var updated = _.merge(invite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invite);
    });
  });
};

// Deletes a invite from the DB.
exports.destroy = function(req, res) {
  Invite.findById(req.params.id, function (err, invite) {
    if(err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    invite.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
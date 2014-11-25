'use strict';

var _ = require('lodash');
var Invite = require('./invite.model');
var User = require('../user/user.model');

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
  req.body.inviter_id = req.user._id;
  User.findOne({ email: req.body.invitee_email }, function(err, user) {
    if(err) { return handleError(res, err); }
    req.body.invitee_id = user._id;
    Invite.create(req.body, function(err, invite) {
      if(err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      // TODO: Send email to the invitee.
      return res.json(201, invite);
    });
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

// Accept an invite from another user.
exports.accept = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invite.findById(req.params.id, function (err, invite) {
    // 1. Set the invite to expired
    // 2. Add the users to each others friend lists and save them.
    if (err) { return handleError(res, err); }
    if(!invite) { return res.send(404); }
    // 1
    invite.expired = true;
    invite.save(function (err) {
      if (err) { return handleError(res, err); }
      // 2
      User.findById(invite.inviter_id, function(err, inviter) {
        if(err) { return handleError(res, err); }
        if (!inviter) { return res.send(404); }
        User.findById(invite.invitee_id, function(err, invitee) {
          if(err) { return handleError(res, err); }
          if (!invitee) { return res.send(404); }
          // Found both inviter and invitee
          if (!inviter.friends_id) inviter.friends_id = [];
          if (!invitee.friends_id) invitee.friends_id = [];
          // TODO: Should not allow duplicates. Might not be a real problem, though.
          inviter.friends_id.push(invitee._id);
          invitee.friends_id.push(inviter._id);
          inviter.save();
          invitee.save();
          // TODO: Handle errors when updating the users in the DB.
        });
      });
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
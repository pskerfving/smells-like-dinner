'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
  inviter_name: String,
  invitee_email: String,
  schedule: { type: Schema.ObjectId, ref: 'Schedule' },
  expired: Boolean
});

module.exports = mongoose.model('Invite', InviteSchema);
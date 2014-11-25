'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
  inviter_name: String,
  inviter_id: { type: Schema.ObjectId, ref: 'User' },
  invitee_email: String,
  invitee_id: { type: Schema.ObjectId, ref: 'User' },
  schedule_id: { type: Schema.ObjectId, ref: 'Schedule' },
  expired: Boolean
});

module.exports = mongoose.model('Invite', InviteSchema);
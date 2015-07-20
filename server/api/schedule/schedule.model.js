'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  name: String,
  user_id: Schema.ObjectId,
  shoppinglist_id: { type: Schema.ObjectId, ref: 'Shoppinglist'},
  config: {
    nbrDays: Number,
    days: [ Number ]
  },
  days: [{
    mealid: Schema.ObjectId,
    scheduled: Boolean,
    date: Date
  }]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
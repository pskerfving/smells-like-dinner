'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  name: String,
  config: {
    nbrDays: Number,
    days: [ Number ]
  },
  days: [{
    mealid: Schema.ObjectId,
    date: Date
  }]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
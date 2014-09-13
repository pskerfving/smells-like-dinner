/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Schedule = require('./schedule.model');

exports.register = function(socket) {
  Schedule.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Schedule.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('schedule:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('schedule:remove', doc);
}
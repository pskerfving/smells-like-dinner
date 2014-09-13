/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Meal = require('./meal.model');

exports.register = function(socket) {
  Meal.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Meal.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('meal:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('meal:remove', doc);
}
/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Shoppinglist = require('./shoppinglist.model');

exports.register = function(socket) {
  Shoppinglist.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Shoppinglist.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('shoppinglist:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('shoppinglist:remove', doc);
}
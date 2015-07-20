/* global io */
'use strict';

angular.module('sldApp')
  .factory('socket', function(socketFactory) {

    console.log('INITIALIZING SOCKET SERVICE');

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          console.log('SOCKET update received for : ', modelName);
          console.log('Data : ', item);

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            console.log('OLD NEWS');
            angular.copy(item, array[index]);
//            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Register listeners to sync a single object (Schedule or ShoppingList)
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Object} obj
       * @param {Function} reloadFn
       * @param {Function} cb
       */
      syncUpdatesObj: function (modelName, obj, reloadFn, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {

          console.log('SOCKET update received for : ', modelName);
          console.log('Data : ', item);

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (item._id === obj._id) {
            console.log('THIS IS MY OBJECT');
//            if (item.__v > obj.__v) {
              console.log('This a new version of my cache!!!');
              // Need to do a reload from backend so that all dependencies are loaded.
              reloadFn(item);
//            }
          }

          cb(obj);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

        /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });

'use strict';

angular.module('sldApp')
  .filter('columnize', function () {

    var cache = [];
    var cacheLen = 0;

    return function(arr, cols) {
      if (!arr) {
        return;
      }
      if (cacheLen === arr.length) {
        return cache;
      }
      cacheLen = arr.length;
      cache = []; // Reset cache to initial state.
      var length = Math.ceil(arr.length / cols);
      for (var i=0; i<cols; i++) {
        var start = i * length;
        cache.push(arr.slice(start, start + length));
      }
      return cache;
    };
  });


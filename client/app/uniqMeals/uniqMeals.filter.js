'use strict';

angular.module('sldApp')
  .filter('uniqMeals', function () {
    return function (input) {
      // Loop through the array and remove all duplicates.
      if (!input) return;
      for (var i = 0; i < input.length; i++) {
        for (var j = i + 1; j < input.length; j++) {
          if (input[i].meal === input[j].meal) {
            input.splice(j, 1);
          }
        }
      }
      return input;
    };
  });

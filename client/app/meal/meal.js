'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/meal/:mealId', {
        templateUrl: 'app/meal/meal.html'
      });
  });

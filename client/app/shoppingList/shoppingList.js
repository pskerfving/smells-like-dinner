'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shoppinglist', {
        templateUrl: 'app/shoppingList/shoppinglist.html'
      });
  });
'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shoppinglist', {
        templateUrl: 'app/views/shoppinglist/shoppinglist.html',
        controller: 'ShoppingListViewCtrl'
      });
  })
  .controller('ShoppingListViewCtrl', function(menuService) {
    menuService.setMenu([
        {
          title: 'Till fulla sajten',
          link: '/',
          anchor: false
        }]);
      });

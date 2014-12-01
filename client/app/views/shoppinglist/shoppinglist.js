'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shoppinglist', {
        templateUrl: 'app/views/shoppinglist/shoppinglist.html',
        controller: 'ShoppingListViewCtrl'
      });
  })
  .controller('ShoppingListViewCtrl', function($rootScope) {
    $rootScope.navbar = $rootScope.navbar || {};
    copyMenu();

    function copyMenu() {
      var menu = [
        {
          title: 'Till fulla sajten',
          link: '/'
        }];
      while ($rootScope.navbar.menu.length > 0) {
        $rootScope.navbar.menu.pop();
      }
      for (var i = 0; i < menu.length; i++) {
        $rootScope.navbar.menu.push(menu[i]);
      }
    }
  });

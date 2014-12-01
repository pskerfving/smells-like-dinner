'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/full/full.html',
        controller: 'FullViewCtrl'
      });
  })
  .controller('FullViewCtrl', function($rootScope) {
    $rootScope.navbar = $rootScope.navbar || {};
    copyMenu();

    function copyMenu() {
      var menu = [
        {
          title: '1. Måltider',
          link: '#meals'
        }, {
          title: '2. Schema',
          link: '#shcdule'
        }, {
          title: '3. Ingredienser',
          link: '#ingredients'
        }, {
          title: '4. Inköp',
          link: '#shoppinglist'
        }];
      while ($rootScope.navbar.menu.length > 0) {
        $rootScope.navbar.menu.pop();
      }
      for (var i = 0; i < menu.length; i++) {
        $rootScope.navbar.menu.push(menu[i]);
      }
    }
  });

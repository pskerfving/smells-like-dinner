'use strict';

angular.module('sldApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Schema',
      'link': '/schedule'
    },
      {
        'title': 'Inköp',
        'link': '/shoppinglist'
      }];

    $rootScope.navbar = $rootScope.navbar || {};
    $rootScope.navbar.menu = $rootScope.navbar.menu || [];
    $scope.menu = $rootScope.navbar.menu;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
//      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return false;
//      return route === $location.path();
    };
  });

'use strict';

angular.module('sldApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, menuService) {
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

    $scope.menu = menuService.menu;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
//      $location.path('/login');
    };

    $scope.isActive = function() {
      return false;
//      return route === $location.path();
    };
  });

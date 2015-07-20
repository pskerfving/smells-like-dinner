'use strict';

angular.module('sldApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
    $scope.signup = false;

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }, function() {
          $scope.user.password = '';
          Auth.isLoggedInAsync(function() {
            console.log('TRIGGERING LOG IN/OUT EVENT : ', Auth.getCurrentUser());
            $rootScope.$broadcast('userLoggedInOut');
          });
        })
        .then( function() {
          // Logged in, redirect to home
            console.log('LOGGED IN!');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.setSignup = function(state) {
      $scope.signup = state;
    };
  });

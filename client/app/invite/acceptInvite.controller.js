'use strict';

angular.module('sldApp')
  .controller('AcceptInviteCtrl', function ($scope, $rootScope, inviteService) {

    inviteService.loadInvites().then(function(value) {
      // SUCCESS. Invites loaded.
      $scope.invites = value;
    }, function() {
      // FAILURE
      console.log('AcceptInviteCtrl : Failed to load invites.');
      $scope.invites = [];
    });

    $scope.isInvited = function() {
      if ($scope.invites) {
        return $scope.invites.length > 0;
      }
      return false;
    };

    $scope.acceptInvite = function(invite) {
      inviteService.acceptInvite(invite).then(function() {
          // SUCCESS!
          $scope.invites.splice($scope.invites.indexOf(invite), 1);
          $rootScope.$broadcast('userLoggedInOut'); // Just to get an update of all parts of the view.
        }, function(err) {
          // FAIL.
        console.log(err);
        });
    };
  });

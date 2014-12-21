'use strict';

angular.module('sldApp')
  .controller('AcceptInviteCtrl', function ($scope, $rootScope, inviteService, User, Auth) {

    inviteService.loadInvites().then(function(value) {
      $scope.invites = value;
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

'use strict';

angular.module('sldApp')
  .controller('AcceptInviteCtrl', function ($scope, inviteService, User, Auth) {

    inviteService.loadInvites().then(function(value) {
      $scope.invites = value;
      $scope.invited = false;
      var user = Auth.getCurrentUser();
      for (var i = 0; i < $scope.invites.length; i++) {
        if ($scope.invites[i].invitee_email === user.email) {
          $scope.invited = true;
        }
      }
    });

    $scope.acceptInvite = function(invite) {
      inviteService.acceptInvite(invite).then(function() {
        // SUCCESS!
        $scope.invites.splice($scope.invites.indexOf(invite), 1);
        $rootScope.$broadcast('userLoggedInOut');
        }, function(err) {
          // FAIL.
        });
    };
  });

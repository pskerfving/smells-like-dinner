'use strict';

angular.module('sldApp')
  .controller('AcceptInviteCtrl', function ($scope, inviteService, User, Auth) {

    inviteService.loadInvites().then(function(value) {
      $scope.invites = value;
      $scope.invited = false;
      var user = Auth.getCurrentUser();
      for (var i = 0; i < $scope.invites.length; i++) {
        if ($scope.invites[i].invitee_email === user.email) {
          user.schedule_id = $scope.invites[i].schedule_id;
          user = $scope.invites[i];
          $scope.invited = true;
        }
      }
    });

    $scope.acceptInvite = function(invite) {
      invite.expired = true;
      inviteService.saveInvite(invite).then(function() {
        // SUCCESS!
        var user = Auth.getCurrentUser();
        user.schedule_id = invite.schedule_id;
        User.update(user, function() {
          // SUCCESS. Updated user is stored.
          $scope.invites.splice($scope.invites.indexOf(invite), 1);
          $rootScope.$broadcast('userLoggedInOut');
        }, function(err) {
          // FAIL.
        });
      }, function() {
        // FAIL!
      });
    }
  });

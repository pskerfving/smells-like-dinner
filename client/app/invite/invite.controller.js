'use strict';

angular.module('sldApp')
  .controller('InviteCtrl', function ($scope, inviteService, Auth) {

    $scope.email = '';

    $scope.invite = function(form) {
      console.log('email: ', $scope.email);
      var user = Auth.getCurrentUser();
      inviteService.createInvite({
          inviter_name: user.name,
          invitee_email: $scope.email,
          schedule_id: user.schedule_id,
          expired: false
        });
    };
  });

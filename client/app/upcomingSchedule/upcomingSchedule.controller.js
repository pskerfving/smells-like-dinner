'use strict';

angular.module('sldApp')
  .controller('UpcomingscheduleCtrl', function ($scope, SelectedMealService, upcomingScheduleService) {

    $scope.loading = true;

    upcomingScheduleService.calculateUpcoming().then(function(value) {
      // SUCCESS
      $scope.upcoming = value;
      $scope.loading = false;
    }, function() {
      // FAILURE
    });

    $scope.setMeal = function(m) {
      SelectedMealService.setMeal(m);
    };

  });
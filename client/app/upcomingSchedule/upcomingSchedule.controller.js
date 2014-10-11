'use strict';

angular.module('sldApp')
  .controller('UpcomingscheduleCtrl', function ($scope, SelectedMealService, upcomingScheduleService) {

    upcomingScheduleService.calculateUpcoming().then(function(value) {
      // SUCCESS
      $scope.upcoming = value;
    }, function() {
      // FAILURE
    });

    $scope.setMeal = function(m) {
      SelectedMealService.setMeal(m);
    };

  });
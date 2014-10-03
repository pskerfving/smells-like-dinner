'use strict';

angular.module('sldApp')
  .controller('UpcomingscheduleCtrl', function ($scope, scheduleService, SelectedMealService) {

    scheduleService.loadSchedule().then(function() {
      $scope.vs = scheduleService.setupViewSchedule();
      $scope.upcoming = calculateUpcoming();
    });

    function calculateUpcoming() {
      // TODO: Once todays date has been done in the schedule, this function should shift...
      // TODO: the array until today is first. Similar applies to the shopping list.
      // Ta bort tomma meals.
      var u = [];
      for (var i = 0; i < $scope.vs.length; i++) {
        if ($scope.vs[i].meal) {
          u.push($scope.vs[i]);
        }
      }
      $scope.vs = u;
      return $scope.vs;
    }

    $scope.setMeal = function(m) {
      SelectedMealService.setMeal(m);
    };

  });
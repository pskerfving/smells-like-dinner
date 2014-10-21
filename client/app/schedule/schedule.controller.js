'use strict';

angular.module('sldApp')
  .controller('ScheduleCtrl', function ($scope, $modal, $log, $q, scheduleService) {

    scheduleService.loadSchedule().then(function(value) {
        // Success!

        $scope.schedule = value;
        $scope.scheduleConfig = value.config;
        $scope.days = [
          {
            day: 1,
            name: 'Måndag',
            abbr: 'Må',
            state: $scope.scheduleConfig.days.indexOf(1) > -1
          }, {
            day: 2,
            name: 'Tisdag',
            abbr: 'Ti',
            state: $scope.scheduleConfig.days.indexOf(2) > -1
          }, {
            day: 3,
            name: 'Onsdag',
            abbr: 'On',
            state: $scope.scheduleConfig.days.indexOf(3) > -1
          }, {
            day: 4,
            name: 'Torsdag',
            abbr: 'To',
            state: $scope.scheduleConfig.days.indexOf(4) > -1
          }, {
            day: 5,
            name: 'Fredag',
            abbr: 'Fr',
            state: $scope.scheduleConfig.days.indexOf(5) > -1
          }, {
            day: 6,
            name: 'Lördag',
            abbr: 'Lö',
            state: $scope.scheduleConfig.days.indexOf(6) > -1
          }, {
            day: 7,
            name: 'Söndag',
            abbr: 'Sö',
            state: $scope.scheduleConfig.days.indexOf(7) > -1
          }];

      $scope.$watch('scheduleConfig.nbrDays', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          scheduleService.changeScheduleNbrDays(newValue);
          scheduleService.saveSchedule();
          console.log('changing the number of days in schedule. ' + $scope.scheduleConfig.nbrDays);
        }
      });

      $scope.$watch('scheduleConfig.days', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          scheduleService.saveSchedule();
        }
      });

    });

    $scope.clearScheduleDay = function (index) {
      $scope.schedule.days[index].mealid = null;
      $scope.schedule.days[index].meal = undefined;
      scheduleService.saveSchedule();
    };

    $scope.addDayToSchedule = function(index) {
      $scope.schedule.days[index].scheduled = true;
      scheduleService.saveSchedule();
    };

    $scope.removeDayFromSchedule = function(index) {
      $scope.schedule.days[index].scheduled = false;
      scheduleService.saveSchedule();
    };

    $scope.onDropComplete = function(index, data/*, evt*/){
      if (data.day) {
        var droppedMeal = data.meal;
        var droppedID = data.mealid;
        var targetMeal = $scope.schedule.days[index].meal;
        var targetID = $scope.schedule.days[index].mealid;
        data.meal = targetMeal;
        data.mealid = targetID;
        $scope.schedule.days[index].meal = droppedMeal;
        $scope.schedule.days[index].mealid = droppedID;
      } else {
        //Dropped a meal from the meal list.
        $scope.schedule.days[index].meal = data;
        $scope.schedule.days[index].mealid = data._id;
      }
      scheduleService.saveSchedule();
    };

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'dayConfigTemplate.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.days;
          }
        }
      });

      modalInstance.result.then(function (result) {
        $scope.scheduleConfig.days = result;
        $log.info($scope.scheduleConfig.days.toString());
        scheduleService.setupSchedule();
        scheduleService.saveSchedule();
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  }).controller('ModalInstanceCtrl', function($scope, $modalInstance, items, scheduleService) {

    $scope.days = items;

    $scope.toggleDayState = function (index) {
      console.log('changing day state');
      $scope.days[index].state = !$scope.days[index].state;
    };

    $scope.ok = function () {
      var result = [];
      for (var i = 1; i < 8; i++) {
        if ($scope.days[i - 1].state) {
          result.push(i);
        }
      }
      $modalInstance.close(result);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
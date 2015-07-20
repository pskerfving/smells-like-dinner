'use strict';

angular.module('sldApp')
  .controller('ScheduleCtrl', function ($scope, $modal, $log, $q, scheduleService) {

    $scope.loading = true;

    scheduleService.loadSchedule().then(function(value) {
        // Success!
        $scope.loading = false;
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
      var item = $scope.schedule.days[index];
      item.mealid = null;
      item.meal = undefined;
      item.loading = true;
      scheduleService.saveSchedule().then(function() {
        item.loading = false;
      }, function(err) {
        item.loading = false;
        item.error = err;
      });
    };

    $scope.addDayToSchedule = function(index) {
      var item = $scope.schedule.days[index];
      item.scheduled = true;
      item.loading = true;
      scheduleService.saveSchedule().then(function() {
        item.loading = false;
      }, function(err) {
        item.loading = false;
        item.error = err;
      });
    };

    $scope.removeDayFromSchedule = function(index) {
      var item = $scope.schedule.days[index];
      item.scheduled = false;
      scheduleService.saveSchedule().then(function() {
        item.loading = false;
      }, function(err) {
        item.loading = false;
        item.error = err;
      });
    };

    $scope.onDropComplete = function(index, data/*, evt*/){
      var target = $scope.schedule.days[index];
      if (data.day) {
        var droppedMeal = data.meal;
        var droppedID = data.mealid;
        var targetMeal = target.meal;
        var targetID = target.mealid;
        data.loading = true;
        target.loading = true;
        data.meal = targetMeal;
        data.mealid = targetID;
        $scope.schedule.days[index].meal = droppedMeal;
        $scope.schedule.days[index].mealid = droppedID;
      } else {
        //Dropped a meal from the meal list.
        target.loading = true;
        target.meal = data;
        target.mealid = data._id;
      }
      scheduleService.saveSchedule().then(function() {
        data.loading = false;
        target.loading = false;
      }, function(err) {
        target.error = err;
        target.loading = false;
        data.loading = false;
      });
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

  }).controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

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

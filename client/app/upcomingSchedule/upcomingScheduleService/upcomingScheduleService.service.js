'use strict';

angular.module('sldApp')
  .service('upcomingScheduleService', function ($q, $rootScope, scheduleService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var deferred;
    var upcoming = [];

    $rootScope.$on('scheduleChanged', function() {
      emptyUpcoming();
      scheduleService.loadSchedule().then(function(value) {
        upcomingFromSchedule(value.days);
      }, function(err) {
        console.log(err);
      });
    });

    $rootScope.$on('userLoggedInOut', function() {
      deferred = undefined;
    });

    function emptyUpcoming() {
      while (upcoming.length > 0) {
        upcoming.pop();
      }
    }

    function upcomingFromSchedule(schedule) {
      var foundToday = false;
      var todayIndex;
      var sl = schedule.length;
      var lim = sl;
      for (var i = 0; i < lim; i++) {
        var i2 = i % sl;
        if (!foundToday && schedule[i2].today) {
          foundToday = true;
          todayIndex = i;
          lim = i + sl; // Move the end of the for loop forward to wrap around the end of the schedule.
        }
        if (foundToday && upcoming.length < 10 && schedule[i2].scheduled && schedule[i2].meal) {
          var m = schedule[i2];
          if (m.meal) {
            m.meal.empty = (m.meal.ingredients.length === 0);
          }
          m.daysUntil = i - todayIndex;  // How many days into the future is this meal?
          // Only push the meal if it is not already shopped
          if (!m.meal.shopped || !m.meal.shopped[0]) {
            upcoming.push(m);
          } else {
            if (m.meal.shopped[0].date < new Date()) {
              upcoming.push(m);
            }
          }
        }
      }
      if (!foundToday) { return schedule; }
      return upcoming;
    }

    this.calculateUpcoming = function() {

      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      scheduleService.loadSchedule().then(function(value) {
        // SUCCESS
        upcomingFromSchedule(value.days);
        deferred.resolve(upcoming);
      }, function(err) {
        // FAILURE
        deferred.reject(err);
      });
      return deferred.promise;
    };


  });

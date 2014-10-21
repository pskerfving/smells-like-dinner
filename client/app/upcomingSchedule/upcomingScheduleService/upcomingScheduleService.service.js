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

    function emptyUpcoming() {
      while (upcoming.length > 0) {
        upcoming.pop();
      }
    }

    function upcomingFromSchedule(schedule) {
      var foundToday = false;
      var sl = schedule.length;
      var lim = sl;
      for (var i = 0; i < lim; i++) {
        var i2 = i % sl;
        if (!foundToday && schedule[i2].today) {
          foundToday = true;
          lim = i + sl; // Move the end of the for loop forward to wrap around the end of the schedule.
        }
        if (foundToday && upcoming.length < 10 && schedule[i2].scheduled && schedule[i2].meal) {
          var m = schedule[i2];
          if (m.meal) {
            m.meal.empty = (m.meal.ingredients.length === 0);
          }
          upcoming.push(m);
        }
      }
      if (!foundToday) { return schedule; }
      return upcoming;
    }

    this.calculateUpcoming = function() {

      deferred = deferred || $q.defer();
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

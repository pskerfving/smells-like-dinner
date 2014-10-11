'use strict';

angular.module('sldApp')
  .service('upcomingScheduleService', function ($q, scheduleService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;

    this.calculateUpcoming = function() {

      cache = cache || $q.when(scheduleService.loadSchedule()).then(function(value) {
        // SUCCESS
        var schedule = value.days;

        var cache = [];
        var foundToday = false;
        var sl = schedule.length;
        var lim = sl;
        for (var i = 0; i < lim; i++) {
          var i2 = i % sl;
          if (!foundToday && schedule[i2].today) {
            foundToday = true;
            lim = i + sl; // Move the end of the for loop forward to wrap around the end of the schedule.
          }
          if (foundToday && cache.length < 10 && schedule[i2].scheduled && schedule[i2].meal) {
            var m = schedule[i2];
            if (m.meal && m.meal.ingredients.length == 0) {
              m.empty = true;
            }
            cache.push(m);
          }
        }
        if (!foundToday) return schedule;
        return cache;
      }, function() {
        // FAILURE
      });
      return cache;


    };

  });

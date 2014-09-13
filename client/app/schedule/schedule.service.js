'use strict';

angular.module('sldApp')
  .service('scheduleService', function ($resource, $q, mealService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache; // containing cache.config & cache.days
    var vsCache = [];

    var Schedule = $resource('/api/schedules/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadSchedule = function() {

      if (cache) {
        return $q.when(cache);
      } else {
        return $q.all(
          [mealService.loadMeals(), this.loadScheduleFromDB()]
        ).then(function (value) {
            // SUCCESS! Do the mapping between days and meals
            var m = value[0]; // list of meals
            var s = value[1].days; // days in schedule
            for (var i = 0; i < s.length; i++) {
              for (var j = 0; j < m.length; j++) {
                if (m[j]._id === s[i].mealid) {
                  s[i].meal = m[j];
                  break;
                }
              }
            }
            cache = value[1];
            return cache;
          }, function (reason) {
            // FAILURE!
            console.log('Loading schedule failed! : ' + reason);
            return $q.reject();
          });
        }
    };

    this.loadScheduleFromDB = function() {
      var deferred = $q.defer();
      Schedule.query(function (data) {
        // SUCCESS!
        cache = data[0];
        deferred.resolve(data[0]);
        return cache;
      }, function(reason) {
        // FAILURE!
        console.log('Failed to load Schedule from DB : ' + reason);
        deferred.reject();
        return reason;
      });
      return deferred.promise;
    };

    this.setupViewSchedule = function(nbrDays) {
      // Fastest way to empty an array! :-O
      if (cache) {
        while(vsCache.length > 0) {
          vsCache.pop();
        }
        if (nbrDays === undefined) { nbrDays = cache.config.nbrDays; }
        for (var i = 0; i < nbrDays; i++) {
          var day = (i + 1) % 7;
          if (cache.config.days.indexOf(day) > -1 ) {
            // The weekday is configured to be shown in the view.
            vsCache.push(cache.days[i]);
            vsCache[vsCache.length - 1].day = day;
          }
        }
      }
      return vsCache;
    };

    this.changeScheduleNbrDays = function() {
      console.log('changing schedule config');
      if (cache.days.length < cache.config.nbrDays) {
        // Add the missing days.
        var scheduleLength = cache.days.length;
        for (var i = 0; i < cache.config.nbrDays - scheduleLength; i++) {
          cache.days.push({ mealid: 0 });
        }
      }
      this.setupViewSchedule();
    };

  });

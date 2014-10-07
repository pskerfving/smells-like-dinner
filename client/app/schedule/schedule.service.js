'use strict';

angular.module('sldApp')
  .service('scheduleService', function ($resource, $q, mealService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache; // containing cache.config & cache.days

    var Schedule = $resource('/api/schedules/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadSchedule = function() {

      cache = cache || $q.all(
        [mealService.loadMeals(), this.loadScheduleFromDB()]
      ).then(function (value) {
          // SUCCESS! Do the mapping between days and meals
          var m = value[0]; // list of meals
          var s = value[1].days; // days in schedule
          for (var i = 0; i < s.length; i++) {
            if (s[i]) {
              for (var j = 0; j < m.length; j++) {
                if (m[j]._id === s[i].mealid) {
                  s[i].meal = m[j];
                  break;
                }
              }
            }
          }
          setupSchedule();
          findToday();
          return value[1];
        }, function (reason) {
          // FAILURE!
          console.log('Loading schedule failed! : ' + reason);
        });
      return cache;
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

    // Calculate what days are to be shown (viewSchedule) in the listing based on the configuration.
    this.setupViewSchedule = function(nbrDays) {
      var vs = [];
      if (cache) {
        if (nbrDays === undefined) {
          nbrDays = cache.config.nbrDays;
        }
        for (var i = 0; i < nbrDays; i++) {
          var day = (i + 1) % 7;
          if (i > (cache.days.length - 1)) { cache.days.push({ mealid: null, meal: undefined }); }
          if (cache.config.days.indexOf(day) > -1 ) {
            // The weekday is configured to be shown in the view.
            vs.push(cache.days[i]);
            // Problemet är att cache tar slut. Den har inte blivit förlängd av changeScheduleNbrDays.
            vs[vs.length - 1].day = day;
          }
        }
      }
      return vs;
    };

    this.saveSchedule = function() {
      console.log('saving schedule');
      Schedule.update(cache, function() {
        // SUCCESS
        console.log('Schedule saved successfully');
      }, function(err) {
        // FAILURE
        console.log(err);
      });
    };

    this.changeScheduleNbrDays = function(nbrDays) {
      cache.config.nbrDays = nbrDays;
      if (cache.days.length < nbrDays) {
        // Add the missing days.
        var scheduleLength = cache.days.length;
        console.log('extending the schedule to (days): ' + cache.config.nbrDays);
        for (var i = 0; i < nbrDays - scheduleLength; i++) {
          cache.days.push({ mealid: null });
          cache.days[i].scheduled = (cache.config.days.indexOf(day) > -1);
        }
      }
      this.saveSchedule();
    };

    function setupSchedule() {
      for (var i = 0; i < cache.days.length; i++) {
        var day = i % 7 + 1;
        cache.days[i].scheduled = (cache.config.days.indexOf(day) > -1);
        cache.days[i].day = day;
      }
    }

    this.setupSchedule = function() {
      setupSchedule();
    };

    function findToday() {
      // Return todays meal.
//      var latest = cache.days[0];
      var latestIndex = -1;
      if (!cache) { return; }
      for (var i = 0; i < cache.days.length; i++) {
        // Find the meal with the newest date tag.
        cache.days[i].today = false; // Reset all as we go.
        if (cache.days[i].date) {
          if (latestIndex == -1) {
            latestIndex = i;
          } else {
            if (cache.days[i].date > cache.days[latestIndex].date) {
              latestIndex = i;
            }
          }
        }
      }
      // Use the latest timestamp to find todays meal.
      if (latestIndex > -1) {
        var diff = Math.floor((new Date() - new Date(cache.days[latestIndex].date))/(1000*3600*24));
        latestIndex = (latestIndex + diff) % cache.config.nbrDays;
      }
      else {
        // We did not find a latest. Set today to the first day in the schedule with the same weekday.
        latestIndex = new Date().getDay() - 1;
      }
      cache.days[latestIndex].today = true;
      cache.days[latestIndex].date = new Date();
      // Set the date and store the schedule to the db.
    }

  });

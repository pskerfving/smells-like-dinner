'use strict';

angular.module('sldApp')
  .service('scheduleService', function ($resource, $q, mealService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache; // containing cache.config & cache.days

    var Schedule = $resource('/api/schedules/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadSchedule = function() {

      console.log('Load schedule');

      if (cache) {
        console.log('HIT!!!!! in SCHEDULE cache, getting from server.');
        return $q.when(cache);
      } else {
        console.log('Miss in SCHEDULE cache, getting from server.');
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

    // Calculate what days are to be shown (viewSchedule) in the listing based on the configuration.
    this.setupViewSchedule = function(nbrDays) {
      var vs = [];
      if (cache) {
        if (nbrDays === undefined) {
          console.log('setting nbrDays');
          nbrDays = cache.config.nbrDays;
        }
        console.log('nbrOfDays: ' + nbrDays);
        for (var i = 0; i < nbrDays; i++) {
          var day = (i + 1) % 7;
          if (cache.config.days.indexOf(day) > -1 ) {
            // The weekday is configured to be shown in the view.
            vs.push(cache.days[i]);
            // Problemet är att cache tar slut. Den har inte blivit förlängd av changeScheduleNbrDays.
            console.log('day : ', day);
            vs[vs.length - 1].day = day;
          }
        }
      }
      console.log('Length of vs: ' + vs.length);
      return vs;
    };

    this.saveSchedule = function() {
      console.log('saving schedule');
      cache.$save();
      // TODO: Handle failure. Show a message.
    };

    this.changeScheduleNbrDays = function(nbrDays) {
      console.log('changing schedule config');
      console.log('cache.days.length : ' + cache.days.length);
      console.log('cache.config.nbrDays : ' + cache.config.nbrDays);
      cache.config.nbrDays = nbrDays;
      if (cache.days.length < nbrDays) {
        // Add the missing days.
        var scheduleLength = cache.days.length;
        console.log('extending the schedule to (days): ' + cache.config.nbrDays);
        for (var i = 0; i < nbrDays - scheduleLength; i++) {
          cache.days.push({ mealid: 0 });
        }
      }
      console.log('*** cache length: ' + cache.days.length);
    };

    function updateTodaysDate() {

    };

  });

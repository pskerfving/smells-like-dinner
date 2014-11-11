'use strict';

angular.module('sldApp')
  .service('scheduleService', function ($resource, $q, mealService, $rootScope, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var deferred;
    var cache; // containing cache.config & cache.days

    var Schedule = $resource('/api/schedules/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadSchedule = function() {
      return loadSchedulePrivate()
    };

    function loadSchedulePrivate() {

      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      $q.all([ mealService.loadMeals(), loadScheduleFromDB() ]).then(function (value) {
        // SUCCESS! Do the mapping between days and meals
        console.log('schedule loaded : ', cache.days.length);
        var m = value[0]; // list of meals
        var s = cache.days; // days in schedule
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
        setupSchedule(false);
        findToday();
        deferred.resolve(cache);
      }, function (reason) {
        // FAILURE!
        console.log('Loading schedule failed! : ' + reason);
        deferred.reject(reason);
      });
      return deferred.promise;
    }

    function loadScheduleFromDB() {
      var deferred = $q.defer();
      var user_id = null;
      if (Auth.isLoggedIn()) {
        user_id = Auth.getCurrentUser()._id;
      }
      console.log('meal service load. user_id : ', user_id);
      Schedule.query({ user_id: user_id }, function (data) {
        // SUCCESS!
        if (data.length === 0) {
          console.log('no schedule entries returned, creating new template...');
          // Create a new
          var schedule = getTemplate(user_id);
          Schedule.save(schedule, function(response) {
            // If we get here cache must have some content.
            schedule._id = response._id;
            deepCopySchedule(cache, schedule);
            $rootScope.$broadcast('scheduleChanged');
            deferred.resolve(cache);
          }, function(err) {
            console.log('failed to save new schedule for user.');
            deferred.reject(err);
          });
        } else {
          if (!cache) {
            cache = data[0];
          } else {
            deepCopySchedule(cache, data[0]);
          }
          $rootScope.$broadcast('scheduleChanged');
          deferred.resolve(cache);
        }
      }, function(reason) {
        // FAILURE!
        console.log('Failed to load Schedule from DB : ' + reason);
        deferred.reject(reason);
      });
      return deferred.promise;
    }

    this.saveSchedule = function() {
      var deferred = $q.defer();
      console.log('saving schedule');
      Schedule.update(cache, function() {
        // SUCCESS
        $rootScope.$broadcast('scheduleChanged'); // Should this fire even if the save was not successfull?
        deferred.resolve();
        console.log('Schedule saved successfully');
      }, function(err) {
        // FAILURE
        deferred.reject();
        console.log(err);
      });
      return deferred.promise;
    };

    function emptyArray(a) {
      while (a.length > 0) {
        a.pop();
      }
    }

    function copyArray(dest, src) {
      for (var i = 0; i < src.length; i++) {
        dest.push(src[i]);
      }
    }

    function deepCopySchedule(dest, src) {
      dest._id = src._id;
      dest.name = src.name;
      dest.user_id = src.user_id;
      if (!dest.config) {
        // This should never happen.
        dest.config = {};
        dest.config.days = [];
      }
      dest.config.nbrDays = src.config.nbrDays;
      emptyArray(dest.config.days);
      copyArray(dest.config.days, src.config.days);
      if (!dest.days) { dest.days = []; }
      emptyArray(dest.days);
      copyArray(dest.days, src.days);
    }

    $rootScope.$on('userLoggedInOut', function() {
      deferred = undefined;
      console.log('broadcast caught in schedule service. the user logged in or out');
      loadSchedulePrivate();
    });

    this.changeScheduleNbrDays = function(nbrDays) {
      cache.config.nbrDays = nbrDays;
      if (nbrDays < cache.days.length) {
        cache.days.splice(nbrDays, cache.days.length - nbrDays);
      }
      setupSchedule();
      this.saveSchedule();
    };

    function setupSchedule(reset) {
      reset = reset || false;
      for (var i = 0; i < cache.config.nbrDays; i++) {
        var day = i % 7 + 1;
        if (i >= cache.days.length) {
          cache.days.push({
            mealid: null,
            meal: undefined,
            scheduled: (cache.config.days.indexOf(day) > -1)
          });
        }
        // Reset = true when called from the config dialog. Overrides the schedule stored in the db.
        if (reset) {
          cache.days[i].scheduled = (cache.config.days.indexOf(day) > -1);
        }
        cache.days[i].day = day;
      }
    }

    this.setupSchedule = function() {
      setupSchedule(true);
    };

    function findToday() {
      // Return todays meal.
      var latestIndex = -1;
      if (!cache) { return; }
      for (var i = 0; i < cache.days.length; i++) {
        // Find the meal with the newest date tag.
        cache.days[i].today = false; // Reset all as we go.
        if (cache.days[i].date) {
          if (latestIndex === -1) {
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
        // TODO: This will not work if the user has not been logged on for more than a week. Maybe not so interested then?
        var diff = (new Date().getDay() - new Date(cache.days[latestIndex].date).getDay());
//        var diff = Math.round((new Date() - new Date(cache.days[latestIndex].date))/(1000*3600*24));
        if (diff < 0) { diff += 7; }
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

    function getTemplate(user) {
      return {
        name: "Middageschema",
        user_id: user,
        config: {
          nbrDays: 7,
          days: [1, 2, 3, 4, 5]
        },
        days: [{
          mealid: null,
          scheduled: true
        }, {
          mealid: null,
          scheduled: true
        }, {
          mealid: null,
          scheduled: true
        }, {
          mealid: null,
          scheduled: true
        }, {
          mealid: null,
          scheduled: true
        }, {
          mealid: null,
          scheduled: false
        }, {
          mealid: null,
          scheduled: false
        }]
      };
    }

  });

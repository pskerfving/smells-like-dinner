'use strict';

angular.module('sldApp')
  .service('mealService', function ($http, $q, $resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;

    var Meal = $resource('/api/meals/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadMeals = function() {

      if (cache) {
        return $q.when(cache);
      } else {
        console.log('miss in meals cache, getting from server.');
        var deferred = $q.defer();
        Meal.query(function(data) {
          cache = data;
          deferred.resolve(cache);
        }, function(/* errResponse */) {
          console.log('something went wrong fetching the data. fallback to local.');
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject();
        });
        return deferred.promise;
      }
    };

    this.createMeal = function(meal) {
      Meal.save(meal, function(response) {
        meal._id = response._id;
      });
    };

    this.updateMeal = function(meal) {
      Meal.update(meal, function() {
        console.log('Meal updated on server');
      }, function() {
        console.log('Failed to update meal on server')
      });
    };

    this.deleteMeal = function(meal) {
      var url = '/api/meals/' + meal._id;
      var Meal = $resource(url);
      Meal.delete(meal._id);
    };

  });

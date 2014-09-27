'use strict';

angular.module('sldApp')
  .service('mealService', function ($q, $resource, ingredientService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;

    var Meal = $resource('/api/meals/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadMeals = function() {

      if (cache) {
        console.log('HIT!!!!! in MEALS cache, getting from server.');
        return $q.when(cache);
      } else {
        console.log('miss in meals cache, getting from server.');
        var deferred = $q.defer();
        $q.all([Meal.query(), ingredientService.loadIngredients()]).then(function(data) {
          // SUCCESS!
          cache = data[0];
          // TODO: Map the meals to its corresposnding ingredients.
          deferred.resolve(cache);
        }, function(errResponse) {
          //FAILURE!
          console.log('something went wrong fetching the data. fallback to local.');
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject(errResponse);
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
        console.log('Failed to update meal on server');
      });
    };

    this.deleteMeal = function(meal) {
      var url = '/api/meals/' + meal._id;
      var Meal = $resource(url);
      Meal.delete(meal._id);
    };

  });

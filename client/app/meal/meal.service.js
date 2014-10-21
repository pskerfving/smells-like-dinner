'use strict';

angular.module('sldApp')
  .service('mealService', function ($q, $resource, $rootScope, ingredientService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;

    var Meal = $resource('/api/meals/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadMeals = function() {

      cache = cache || $q.all(
        [Meal.query(), ingredientService.loadIngredients()])
        .then(function(data) {
        // SUCCESS!
        return data[0];
        // TODO: Map the meals to its corresposnding ingredients.
      }, function(errResponse) {
        //FAILURE!
        console.log('something went wrong fetching the data. fallback to local.', errResponse);
        // TODO. Something is wrong with the error handling further up the line.
      });
      return cache;
    };

    this.createMeal = function(meal) {
      Meal.save(meal, function(response) {
        meal._id = response._id;
      });
    };

    this.updateMeal = function(meal) {
      console.log('Meal to update: ', meal);
      Meal.update(meal, function() {
        console.log('Meal updated on server');
        console.log('Meal to update: ', meal);
      }, function() {
        console.log('Failed to update meal on server');
      });
      $rootScope.$broadcast('mealUpdated', meal);
    };

    this.deleteMeal = function(meal) {
      var url = '/api/meals/' + meal._id;
      var Meal = $resource(url);
      Meal.delete(meal._id);
    };

  });

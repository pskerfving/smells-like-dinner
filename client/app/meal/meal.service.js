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
      Meal.update(meal, function() {
        // SUCCESS
      }, function() {
        //FAILURE
      });
      $rootScope.$broadcast('mealUpdated', meal);
    };

    this.deleteMeal = function(meal) {
      Meal.delete({ id: meal._id }, function() {
        console.log('successfully deleted meal');
      }, function (err) {
        console.log('failed to delete meal: ', err);
      });
    };

  });

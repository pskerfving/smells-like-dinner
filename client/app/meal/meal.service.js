'use strict';

angular.module('sldApp')
  .service('mealService', function ($q, $resource, $rootScope, ingredientService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var ingredients;
    var deferred;

    var Meal = $resource('/api/meals/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadMeals = function() {
      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      $q.all(
        [ Meal.query(), ingredientService.loadIngredients() ])
          .then(function(data) {
        // SUCCESS!
        cache = data[0];
        ingredients = data[1];
        mapToIngredients(cache, ingredients);
        deferred.resolve(cache);
      }, function(errResponse) {
        //FAILURE!
        console.log('something went wrong fetching the data. fallback to local.', errResponse);
        // TODO. Something is wrong with the error handling further up the line.
        deferred.reject();
      });
      return deferred.promise;
    };

    function mapToIngredients(ms, is) {
      for (var i = 0; i < ms.length; i++) {
        var mis = ms[i].ingredients;
//        var mes = ms[i].extras;
        for (var j = 0; j < mis.length; j++) {
          for (var k = 0; k < is.length; k++) {
            if (mis[j].ingredientid === is[k]._id) {
              mis[j].ingredient = is[k];
              break;
            }
          }
        }
      }
    }

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

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
      var deferred = $q.defer();
      Meal.save(meal, function(response) {
        meal._id = response._id;
        deferred.resolve(meal);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.updateMeal = function(meal) {
      var deferred = $q.defer();
      Meal.update(meal, function() {
        // SUCCESS
        $rootScope.$broadcast('mealUpdated', meal);
        deferred.resolve(meal);
      }, function(err) {
        //FAILURE
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.deleteMeal = function(meal) {
      var deferred = $q.defer();
      Meal.delete({ id: meal._id }, function() {
        console.log('successfully deleted meal');
        deferred.resolve();
      }, function (err) {
        console.log('failed to delete meal: ', err);
        deferred.reject(err);
      });
      return deferred.promise;
    };

  });

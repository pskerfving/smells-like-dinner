'use strict';

angular.module('sldApp')
  .service('ingredientService', function ($resource, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var ingredientsCache;
    var Ingredient = $resource('/api/ingredients/:id', { id: '@_id' } );

    this.loadIngredients = function() {
      if (ingredientsCache) {
        return $q.when(ingredientsCache);
      }
      else {
        console.log('miss in ingredients cache');

        var deferred = $q.defer();
        Ingredient.query(function(data) {
          ingredientsCache = data;
          deferred.resolve(ingredientsCache);
        }, function(/* errResponse */) {
          console.log('something went wrong fetching the data. fallback to local.');
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject();
        });
        return deferred.promise;
      }
    };

    this.createIngredient = function(ingredient) {
      console.log('creating new ingredient');
      Ingredient.save(ingredient, function(response) {
        ingredient._id = response._id;
      });
    };

  });

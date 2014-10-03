'use strict';

angular.module('sldApp')
  .service('ingredientService', function ($resource, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var Ingredient = $resource('/api/ingredients/:id', { id: '@_id' } );

    this.loadIngredients = function() {

      function load() {
        var deferred = $q.defer();
        Ingredient.query(function(data) {
          cache = data;
          deferred.resolve(cache);
        }, function(/* errResponse */) {
          console.log('something went wrong fetching the data. fallback to local.');
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject();
        });
        return deferred.promise;
      }

      cache = cache || load();
      return $q.when(cache);
    };

    this.createIngredient = function(ingredient) {
      var deferred = $q.defer();
      Ingredient.save(ingredient, function(response) {
        ingredient._id = response._id;
        console.log('setting _id: ', ingredient._id);
        deferred.resolve(ingredient);
      });
      return deferred.promise;
    };

  });

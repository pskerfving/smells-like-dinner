'use strict';

angular.module('sldApp')
  .service('ingredientService', function ($resource, $q, categoryService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var categories;
    var Ingredient = $resource('/api/ingredients/:id', { id: '@_id' } );
    var deferred;

    this.loadIngredients = function() {

      function load() {

        if (deferred) { return deferred.promise; }
        deferred = $q.defer();
        $q.all(
          [ Ingredient.query(), categoryService.load() ]
        ).then(function(value) {
          // SUCESS
          cache = value[0];
          categories = value[1];
          deferred.resolve(cache);
        }, function(err) {
          // FAILURE
          console.log('something went wrong fetching ingredients. ', err);
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject();
        });
        return deferred.promise;
      }

      return load();
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

    this.updateIngredient = function() {

    };

  });

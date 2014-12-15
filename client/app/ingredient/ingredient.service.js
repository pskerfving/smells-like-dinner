'use strict';

angular.module('sldApp')
  .service('ingredientService', function ($resource, $q, categoryService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var categories;
    var Ingredient = $resource('/api/ingredients/:id', { id: '@_id' }, { update: { method:'PUT' } });
    var deferred;

    this.loadIngredients = function() {
      if (deferred) { return deferred.promise; }
      deferred = $q.defer();
      $q.all(
        [ Ingredient.query(), categoryService.load() ]
      ).then(function(value) {
        // SUCCESS
        cache = value[0];
        categories = value[1];
        mapToCategories(cache, categories);
        deferred.resolve(cache);
      }, function(err) {
        // FAILURE
        console.log('something went wrong fetching ingredients. ', err);
        // TODO. Something is wrong with the error handling further up the line.
        deferred.reject();
      });
      return deferred.promise;
    };

    function mapToCategories(is, cs) {
      for (var i = 0; i < is.length; i++) {
        if (is[i]) {
          for (var j = 0; j < cs.length; j++) {
            if (is[i].category_id === cs[j]._id) {
              is[i].category = cs[j];
              break;
            }
          }
        }
      }

    }

    this.createIngredient = function(ingredient) {
      var deferred = $q.defer();
      Ingredient.save(ingredient, function(response) {
        ingredient._id = response._id;
        console.log('setting _id: ', ingredient._id);
        deferred.resolve(ingredient);
      });
      return deferred.promise;
    };

    this.updateIngredient = function(ingredient) {
      var deferred = $q.defer();
      Ingredient.update(ingredient, function(response) {
        // SUCCESS
        ingredient._id = response._id;
        deferred.resolve(ingredient);
        console.log('saved ingredient to DB successfully.');
      }, function(errResponse) {
        //FAILURE
        console.log('saving ingredient to DB: ', errResponse);
      });
      return deferred.promise;
    };

  });

'use strict';

angular.module('sldApp')
  .service('ingredientService', function ($resource, $q, categoryService, socket, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache = [];
    var categories;
    var Ingredient = $resource('/api/ingredients/:id', { id: '@_id' }, { update: { method:'PUT' } });
    var deferred;

    socket.syncUpdates('ingredient', cache, function() {
      mapToCategories(cache, categories);
    });

    this.loadIngredients = function() {
      if (deferred) { return deferred.promise; }
      deferred = $q.defer();
      $q.all(
        [ Ingredient.query().$promise, categoryService.load() ]
      ).then(function(value) {
        // SUCCESS
        angular.copy(value[0], cache);
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
        // SUCCESS
        ingredient._id = response._id;
        console.log('setting _id: ', ingredient._id);
        deferred.resolve(ingredient);
      }, function(err) {
        // FAILURE
        console.log('Ingredient service. Failed to create new ingredient : ', ingredient);
        deferred.reject(err);
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

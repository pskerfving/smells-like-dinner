'use strict';

angular.module('sldApp')
  .service('mealService', function ($q, $resource, $rootScope, ingredientService, Auth, socket) {

    var cache = [];
    var ingredients;
    var deferred;
    var error;

    var Meal = $resource('/api/meals/:id', { id: '@_id'},
      {
        update: { method:'PUT'},
        shopped: { method: 'PUT', url: '/api/meals/:id/shopped' }
      });
    var MealMe = $resource('/api/meals/me');  // TODO: Put this into the constructor call above.

    socket.syncUpdates('meal', cache, function() {
      mapToIngredients(cache, ingredients);
    });

    this.loadMeals = function() {
      return loadMealsPrivate();
    };

    function loadMealsPrivate() {

      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      var query;
      Auth.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          query = MealMe.query().$promise;
        } else {
          query = Meal.query({ id: 'public' }).$promise;
        }
        $q.all([ query, ingredientService.loadIngredients() ]).then(function(data) {
          // SUCCESS!
          console.log('Meals recieved : ', data[0]);
          if (cache) {
            // This is not the first time we get the data.
            emptyCache();
            copyArray(cache, data[0]);
          } else {
            // First time, just assign.
            cache = data[0];
          }
          ingredients = data[1];
          mapToIngredients(cache, ingredients);
          deferred.resolve(cache);
        }, function(errResponse) {
          //FAILURE!
          console.log('something went wrong fetching the data. fallback to local.', errResponse);
          error = errResponse;
          // TODO. Something is wrong with the error handling further up the line.
          deferred.reject();
        });
      });
      return deferred.promise;
    }

    function emptyCache() {
      while (cache.length > 0) {
        cache.pop();
      }
    }

    function copyArray(a, b) {
      for (var i = 0; i < b.length; i++) {
        a.push(b[i]);
      }
    }

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

    this.createMeal = function(name) {
      var deferred = $q.defer();
      var user_id = null;
      var meal = {
        name: name,
        ingredients: [],
        empty: true
      };
      if (Auth.isLoggedIn()) {
        user_id = Auth.getCurrentUser()._id;
      }
      meal.user_id = user_id;
      Meal.save(meal, function(response) {
        meal._id = response._id;
        deferred.resolve(meal);
      }, function(err) {
        deferred.reject(err);
      });
      return {
        meal: meal,
        promise: deferred.promise
      }
    };

    this.updateMeal = function(meal) {
      var deferred = $q.defer();
      Meal.update(meal, function(response) {
        // SUCCESS
        $rootScope.$broadcast('mealUpdated', meal);
        if (response.__v) { meal.__v = response.__v; }
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
        cache.splice(cache.indexOf(meal), 1);
        deferred.resolve();
      }, function (err) {
        console.log('failed to delete meal: ', err);
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.shoppedMeal = function(meal, id, daysUntil) {
      var deferred = $q.defer();
      var prepDate  = new Date();
      var shoppedObj = {
        shoppinglist_id: id,
        date: prepDate.setDate(prepDate.getDate() + daysUntil)
      };
      meal.shopped = [];  // A meal can only be shopped once. This could be a limitation.
      meal.shopped.push(shoppedObj);
      Meal.shopped(meal, function() {
        // SUCCESS
        console.log('Meal marked as shopped : ', meal.name);
        deferred.resolve(meal);
      }, function(err) {
        console.log('Failed to mark meal as shopped : ', meal.name);
        console.log('Error : ', err);
        deferred.reject();
      });
      return deferred.promise;
    };

    $rootScope.$on('userLoggedInOut', function() {
      deferred = undefined;
      console.log('broadcast caught in meals service. the user logged in or out');
      loadMealsPrivate();
    });

  });

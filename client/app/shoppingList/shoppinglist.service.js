'use strict';

angular.module('sldApp')
  .service('shoppingListService', function ($resource, $q, scheduleService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var sList;
    var viewSchedule;

    var ShoppingList = $resource('/api/shoppinglists/:id', { id: '@_id'},
      { update: { method:'PUT' } });


    this.loadShoppingList = function() {
      if (sList && cache) {
        console.log('HIT! ShoppingList cache');
        return $q.when([sList, cache]);
      } else {
        var deferred = $q.defer();
        $q.all([
          scheduleService.loadSchedule(), this.loadShoppingListFromDB()
        ]).then(function(value) {
          // SUCCESS
          cache = value[1];
          viewSchedule = scheduleService.setupViewSchedule(cache.config.nbrDays);
          sList = assembleShoppingList();
          deferred.resolve([sList, cache]);  // TODO: Should we return the shoppinglist
        }, function(reason) {
          // FAILURE
          console.log('Loading ShoppingList failed : ' + reason);
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    };

    this.loadShoppingListFromDB = function() {
      if (cache) {
        return $q.when(cache);
      } else {
        var deferred = $q.defer();
        ShoppingList.query(function(data) {
          // SUCCESS!
          cache = data[0];
          deferred.resolve(cache);
        }, function(reason) {
          // FAILURE!
          console.log('Failed to load ShoppingList from DB : ' + reason);
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    };

    this.updateShoppingList = function(nbrDays) {
      cache.config.nbrDays = nbrDays;
      viewSchedule = scheduleService.setupViewSchedule(cache.config.nbrDays);
      sList = assembleShoppingList();
      return sList;
    };

    var assembleShoppingList = function() {
      var list = [];
      if (cache && viewSchedule) {
        var dupList = []; // Resulting shoppinglist (including any duplicates.)
        for (var i = 0; i < viewSchedule.length; i++) {
          var m = viewSchedule[i].meal;
          if (m) {
            for (var j = 0; j < m.ingredients.length; j++) {
              dupList.push(m.ingredients[j]);
            }
          }
        }
        // Add the extras
        dupList = dupList.concat(cache.extras);
        // Remove duplicates.
        // TODO: Does this work????
        list = dupList.filter( function(item, pos) {
          return dupList.indexOf(item) == pos;
        });
      }
      return list;
    };

/*
    $scope.addItemName = function(newName) {
      var newItem = { name: newName };
      $scope.ingredients.push(newItem);
      $scope.addItem(newItem);
      $scope.newIngredient = "";
      // TODO: Check that the ingredient is unique
      mealService.createIngredient(newItem);
    };

    $scope.addItem = function (newItem) {
      $scope.shoppingList.push(newItem);
    };
*/

  });

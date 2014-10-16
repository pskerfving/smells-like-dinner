'use strict';

angular.module('sldApp')
  .service('shoppingListService', function ($resource, $q, $rootScope, upcomingScheduleService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;      // The shoppinglist specific data. Removed items, extras, config.
    var upcoming;   // Upcoming meals
    var sList = []; // The assembled shoppinglist, including extras
    var deferred;

    var ShoppingList = $resource('/api/shoppinglists/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadShoppingList = function() {
      if (deferred) {
        return deferred.promise;
      } else {
        deferred = $q.defer();
        $q.all([
          upcomingScheduleService.calculateUpcoming(), this.loadShoppingListFromDB()
        ]).then(function(value) {
          // SUCCESS
          upcoming = value[0];
          sList = collectShoppingList(cache.config.nbrDays);
          deferred.resolve(sList);
        }, function(reason) {
          // FAILURE
          console.log('Loading ShoppingList failed : ' + reason);
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    };

    this.loadShoppingListFromDB = function() {
      // This is not all correct, but should work since only called once.
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

    $rootScope.$on('scheduleChanged', function() {
      emptyUpcoming();
      scheduleService.loadSchedule().then(function(value) {
        upcomingFromSchedule(value.days);
      }, function(err) {
        console.log(err);
      });
    });

    function collectShoppingList(nbrDays) {
      // 0. Empty list.
      // 1. Find today in schedule
      // 2. Loop through the upcoming meals in the schedule.
      // 3. Add each ingredient to the shoppinglist if it does not already exist or is in the list of removed
      //    Each item in the list is an object with:
      //      listname (ingredient or meal), type (ingredient of meal), reference to the ingredient and an array of meals for which it is needed.
      // 4. If a meal has no ingredients. A meal will be referenced.
      var newItem;
      var items = {};
      for (var i = 0; i < upcoming.length; i++) {
        if (nbrDays > 0) {
          if (upcoming[i].meal.ingredients.length > 0) {
            // Loop over ingredients
            for (var j = 0; j < upcoming[i].meal.ingredients.length; j++) {
              // Does ingredient already exist?
              var item = items[upcoming[i].meal.ingredients[j]._id];
              if (!item) {
                // Does not exist, add.
                newItem = {
                  ingredient: upcoming[i].meal.ingredients[j],
                  meals: [ upcoming[i].meal ],
                  meal: null,
                  removed: isRemoved(upcoming[i].meal.ingredients[j]._id)
                };
                items[upcoming[i].meal.ingredients[j]._id] = newItem;
                sList.push(newItem);
              } else {
                // Already exists, add the meal.
                item.meals.push(upcoming[i].meal);
              }
            }
          } else {
            // No igredients add meal.
            newItem = {
              meal: upcoming[i].meal,
              ingredient: null,
              meals: []
            };
            sList.push(newItem);
          }
          nbrDays--;
        } else {
          break;
        }
      }
      return sList;
    }

    function isRemoved(id) {
      for (var i = 0; i < cache.removed.length; i++) {
        if (cache.removed[i].ingredientid == id) {
          return true;
        }
      }
      return false;
    }

    this.updateRemoved = function(item) {
      if (item.removed) {
        // Add to list
        cache.removed.push({ ingredientid: item.ingredient._id });
      } else {
        for (var i = 0; i < cache.removed.length; i++) {
          if (cache.removed[i].ingredientid == item.ingredient._id) {
            cache.removed.splice(i, 1);
          }
        }
      }
      // TODO: Store to server
      this.updateShoppingList();
    };

    this.updateShoppingList = function() {
      ShoppingList.update(cache, function() {
        // SUCCESS
        console.log('ShoppingList saved successfully');
      }, function(err) {
        // FAILURE
        console.log(err);
      });
    };

  });

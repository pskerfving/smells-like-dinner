'use strict';

angular.module('sldApp')
  .service('shoppingListService', function ($resource, $q, $rootScope, upcomingScheduleService, ingredientService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;      // The shoppinglist data from DB. Removed items, extras, config.
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
          upcomingScheduleService.calculateUpcoming(), ingredientService.loadIngredients(), this.loadShoppingListFromDB()
        ]).then(function(value) {
          // SUCCESS
          upcoming = value[0];
          mapIngredients(value[1]);
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
          cache = data[0];  // TODO: This should not necessarily be the first, based on user.
          deferred.resolve(cache);
        }, function(reason) {
          // FAILURE!
          console.log('Failed to load ShoppingList from DB : ' + reason);
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    };

    function mapIngredients(iList) {
      for (var i = 0; i < cache.extras.length; i++) {
        for (var j = 0; j < iList.length; j++) {
          if (cache.extras[i].ingredientid === iList[j]._id) {
            cache.extras[i].ingredient = iList[j];
            break;
          }
        }
      }
    }

    this.getConfig = function() {
      return cache.config;
    };

    $rootScope.$on('scheduleChanged', function() {
      console.log('SHOPPING LIST: schedule updated');
      upcomingScheduleService.calculateUpcoming().then(function() {
        //SUCCESS
        sList = collectShoppingList(cache.config.nbrDays);
      }, function() {
        // FAILURE.
      });
    });

    $rootScope.$on('mealUpdated', function(evt, meal) {
      console.log('SHOPPING LIST: meal updated');
      if (mealInShoppingList(meal)) {
        upcomingScheduleService.calculateUpcoming().then(function() {
          //SUCCESS
          sList = collectShoppingList(cache.config.nbrDays);
        }, function() {
          // FAILURE.
        });
      }
    });

    function mealInShoppingList(meal) {
      var nbrDays = cache.config.nbrDays;
      for (var i = 0; i < upcoming.length; i++) {
        if (nbrDays === 0) {
          break;
        }
        if (upcoming[i].meal._id === meal._id) {
          return true;
        }
        nbrDays--;
      }
      return false;
    }

    function emptyShoppingList() {
      while (sList.length > 0) {
        sList.pop();
      }
    }

    function collectShoppingList(nbrDays) {
      // 0. Empty list.
      // 1. Find today in schedule
      // 2. Loop through the upcoming meals in the schedule.
      // 3. Add each ingredient to the shoppinglist if it does not already exist or is in the list of removed
      //    Each item in the list is an object with:
      //      listname (ingredient or meal), type (ingredient of meal), reference to the ingredient and an array of meals for which it is needed.
      // 4. If a meal has no ingredients. A meal will be referenced.
      nbrDays = nbrDays || cache.config.nbrDays;
      var newItem;
      var items = {};
      emptyShoppingList();
      for (var i = 0; i < upcoming.length; i++) {
        if (upcoming[i].daysUntil <  nbrDays) {
          if (upcoming[i].meal.ingredients.length > 0) {
            // Loop over ingredients
            for (var j = 0; j < upcoming[i].meal.ingredients.length; j++) {
              // Does ingredient already exist?
              var item = items[upcoming[i].meal.ingredients[j].ingredientid];
              if (!item) {
                // Does not exist, add.
                newItem = {
                  ingredient: upcoming[i].meal.ingredients[j].ingredient,
                  meals: [ upcoming[i].meal ],
                  meal: null,
                  removed: isRemoved(upcoming[i].meal.ingredients[j].ingredientid),
                  picked: isPicked(upcoming[i].meal.ingredients[j].ingredientid)
                };
                items[upcoming[i].meal.ingredients[j].ingredientid] = newItem;
                sList.push(newItem);
              } else {
                // Already exists, add to the meal list.
                item.meals.push(upcoming[i].meal);
              }
            }
          } else {
            // No igredients add meal.
            sList.push({
              meal: upcoming[i].meal,
              ingredient: null,
              meals: []
            });
          }
        } else {
          break;
        }
      }
      // Add the extras to sList
      for (i = 0; i < cache.extras.length; i++) {
        // Does not exist, add.
        sList.push({
          ingredient: cache.extras[i].ingredient,
          meals: [],
          meal: null,
          removed: false,
          picked: isPicked(cache.extras[i].ingredient._id)
        });
      }
      return sList;
    }

    this.addExtra = function(arg) {
      // Find the
      var newItem = {
        ingredient: arg.ingredient,
        ingredientid: arg.ingredient._id,
        meals:[],
        meal: null,
        removed: false,
        picked: false
      };
      cache.extras.push(newItem);
      sList = collectShoppingList(cache.config.nbrDays);
      this.updateShoppingList();
    };

    function isRemoved(id) {
      for (var i = 0; i < cache.removed.length; i++) {
        if (cache.removed[i].ingredientid === id) {
          return true;
        }
      }
      return false;
    }

    function isPicked(id) {
      for (var i = 0; i < cache.picked.length; i++) {
        if (cache.picked[i].ingredientid === id) {
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
          if (cache.removed[i].ingredientid === item.ingredient._id) {
            cache.removed.splice(i, 1);
          }
        }
      }
      this.updateShoppingList();
    };

    this.updatePicked = function(item) {
      if (item.picked) {
        // Add to list
        cache.picked.push({ ingredientid: item.ingredient._id });
      } else {
        for (var i = 0; i < cache.picked.length; i++) {
          if (cache.picked[i].ingredientid === item.ingredient._id) {
            cache.picked.splice(i, 1);
          }
        }
      }
      this.updateShoppingList();
    };

    this.clearShoppingList = function() {
      cache.removed = [];
      cache.picked = [];
      cache.extras = [];
      this.updateShoppingList();
      return collectShoppingList();
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

    this.setNbrDays = function(nbrDays) {
      cache.config.nbrDays = nbrDays;
      sList = collectShoppingList();
      this.updateShoppingList();
    };

  });

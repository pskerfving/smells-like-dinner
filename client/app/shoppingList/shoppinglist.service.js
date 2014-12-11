'use strict';

angular.module('sldApp')
  .service('shoppingListService', function ($resource, $q, $rootScope, upcomingScheduleService, ingredientService, scheduleService, mealService, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;      // The shoppinglist data from DB. Removed items, extras, config.
    var upcoming;   // Upcoming meals
    var sList = []; // The assembled shoppinglist, including extras
    var deferred;

    var ShoppingList = $resource('/api/shoppinglists/:id', { id: '@_id'},
      { update: { method:'PUT' } });

    this.loadShoppingList = function() {
      return loadShoppingListPrivate();
    };

    function loadShoppingListPrivate() {
      if (deferred) {
        return deferred.promise;
      } else {
        deferred = $q.defer();
        $q.all([
          upcomingScheduleService.calculateUpcoming(), ingredientService.loadIngredients()
        ]).then(function(value) {
          loadShoppingListFromDB().then(function() {
            // SUCCESS
            upcoming = value[0];
            mapIngredients(value[1]);
            console.log('SHOPPING LIST ALL LOADED', cache);
            emptyArray(sList);
            sList = collectShoppingList(cache.config.nbrDays);
//          copyArray(sList, tmp);
            deferred.resolve(sList);
          }, function(reason) {
            // FAILURE
            console.log('Loading ShoppingList failed : ' + reason);
            deferred.reject(reason);
          });
        }, function(reason) {
          // FAILURE
          console.log('Loading ShoppingList failed : ' + reason);
          deferred.reject(reason);
        });
        return deferred.promise;
      }
    }

    function loadShoppingListFromDB() {

      var deferred = $q.defer();
      var user;
      var id = 'anonymous';

      function createNewUserShoppingList(user_id) {
        var shoppinglist = getTemplate(user_id);
        ShoppingList.save(shoppinglist, function (response) {
          // If we get here cache must have some content.
          shoppinglist._id = response._id;
          user.schedule.shoppinglist_id = response._id;
          scheduleService.setShoppingListId(response._id);
          scheduleService.saveSchedule().then(function () {
            // Success updating schedule with the new shoppinglist id
            deepCopyShoppingList(cache, shoppinglist);
            deferred.resolve(cache);
          }, function () {
            // Failed to update the user.
            console.log('update user with the new shopping list id FAILED!');
          });  // If this fails, it needs to be resolved on the next load.
        }, function (err) {
          console.log('failed to save new shopping list for user.');
          deferred.reject(err);
        });
      }

      // This is not all correct, but should work since only called once.
      Auth.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          user = Auth.getCurrentUser();
          id = user.schedule.shoppinglist_id;
          if (!id) {
            // The user has no shoppinglist. create one!
            // This should never happen. Only if the user was not correctly created in the backend.
            createNewUserShoppingList(user._id);
            return deferred.promise;
          }
        }
        ShoppingList.get({ id: id }, function (data) {
          // SUCCESS!
          console.log('received the shoppinglist: ', data);
          if (!cache) {
            cache = data;
          } else {
            deepCopyShoppingList(cache, data);
          }
          deferred.resolve(cache);
        }, function (reason) {
          console.log('Failed to load ShoppingList from DB : ' + reason);
          deferred.reject(reason);
        });
      });
      return deferred.promise;
    }

    function emptyArray(a) {
      while (a.length > 0) {
        a.pop();
      }
    }

    function copyArray(dest, src) {
      for (var i = 0; i < src.length; i++) {
        dest.push(src[i]);
      }
    }

    function deepCopyShoppingList(dest, src) {
        dest._id = src._id;
      dest.user_id = src.user_id;
      if (!dest.config) {
        // This should never happen.
        dest.config = {};
      }
      dest.config.nbrDays = src.config.nbrDays;
      dest.config.listMode = src.config.listMode;
      if (!dest.removed) { dest.removed = []; }
      emptyArray(dest.removed);
      copyArray(dest.removed, src.removed);
      if (!dest.picked) { dest.picked = []; }
      emptyArray(dest.picked);
      copyArray(dest.picked, src.picked);
      if (!dest.extras) { dest.extras = []; }
      emptyArray(dest.extras);
      copyArray(dest.extras, src.extras);
    }

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
      // This could be called before the shoppinglist has been called at all.
      if (deferred) {
        deferred.promise.then(function() {
          upcomingScheduleService.calculateUpcoming().then(function() {
            //SUCCESS
            sList = collectShoppingList(cache.config.nbrDays);
          }, function() {
            // FAILURE. Could not calculate upcoming.
          });
        }, function() {
          // FAILED to load shoppinglist
        });
      } else {
        loadShoppingListPrivate();
      }
    });

    $rootScope.$on('userLoggedInOut', function() {
      deferred = undefined;
//      loadShoppingListPrivate();
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
          picked: isPicked(cache.extras[i].ingredient._id),
          extra: true
        });
      }
      console.log('sList : ', sList);
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
      if (item.extra) {
        for (var index = 0; index < cache.extras.length; index++) {
          if (cache.extras[index].ingredientid === item.ingredient._id) { break; }
        }
        cache.extras.splice(index, 1);
        sList.splice(sList.indexOf(item), 1);
      }
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
      for (var i = 0; i < upcoming.length; i++) {
        mealService.shoppedMeal(upcoming[i].meal, cache._id, upcoming[i].daysUntil);
      }
      this.updateShoppingList();
      return collectShoppingList();
    };

    this.updateShoppingList = function() {
      var deferred = $q.defer();
      ShoppingList.update(cache, function(response) {
        // SUCCESS
        if (response.__v) { cache.__v = response.__v; }
        deferred.resolve(cache);
        console.log('ShoppingList saved successfully');
      }, function(err) {
        // FAILURE
        deferred.reject(err);
        console.log(err);
      });
      return deferred.promise;
    };

    this.setNbrDays = function(nbrDays) {
      cache.config.nbrDays = nbrDays;
      sList = collectShoppingList();
      this.updateShoppingList();
    };

    function getTemplate(user) {
      return {
        user_id: user,
        config: {
          nbrDays: 2,
          listMode: 'planning'
        },
        removed: [],
        picked: [],
        extras: []
      };
    }

  });

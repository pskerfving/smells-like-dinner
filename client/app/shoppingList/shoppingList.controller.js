'use strict';

angular.module('sldApp')
  .controller('ShoppingListCtrl', function ($scope, scheduleService, ingredientService, mealService, shoppingListService) {

    $scope.loading = true;
    $scope.shoppingList = []; // The complete list, two parts calculated from schedule and additional stuff.
    $scope.listMode = 'planning';

    shoppingListService.loadShoppingList().then(function(value) {
      // Success!
      $scope.loading = false;
      $scope.shoppingList = value;
      $scope.config = shoppingListService.getConfig();
    });

    $scope.toggleListMode = function() {
      $scope.listMode = ($scope.listMode === 'planning' ? 'picking' : 'planning');
    };

    $scope.mainClkAction = function(item) {
      var promise;
      item.loading = true;
      if ($scope.listMode === 'planning') {
        item.removed = !item.removed;
        promise = shoppingListService.updateRemoved(item);
      } else {
        item.picked = !item.picked;
        promise = shoppingListService.updatePicked(item);
      }
      promise.then(function() {
        item.loading = false;
      }, function(err) {
        item.loading = false;
        item.error = err;
      });
    };

    $scope.addExtra = function(newItem) {
      console.log('shoppingList.addItem entered.');
      var res = shoppingListService.addExtra(newItem);
      res.item.loading = true;
      res.promise.then(function() {
        // SUCCESS
        res.item.loading = false;
      }, function(err) {
        // FAILURE
        console.log('ShoppingListCtrl. Failed to addExtra to shoppinglist : ', err);
        res.item.loading = false;
        res.item.error = 'Något gick snett när handlindslistan skulle sparas på servern.';
      });
    };

    $scope.getItemClasses = function(item) {
      return [
        item.loading ? 'loading' : '',
        item.error ? 'error' : ''
      ];
    };

    $scope.onSelect = function($item/*, $model, $label */) {
      $scope.addItem($item);
    };

    $scope.setTimeframe = function(nbrDays) {
      $scope.config.nbrDays = nbrDays;
      shoppingListService.setNbrDays(nbrDays);
    };

    $scope.clearShoppingList = function() {
      shoppingListService.clearShoppingList();
    };

    $scope.onDropComplete = function(item, data) {
      // Drop is only applicable for ingredients, not entire meals. This should never happen.
      if (!item.meal) {
        var ingredient = item.ingredient;
        ingredient.category_id = data._id;
        ingredient.category = data;
        ingredientService.updateIngredient(ingredient);
      }
    };

    $scope.categoryOrderFn = function(item) {
      // Needed to get the uncatgorized items at the top of the shoppinglist.
      if (item.ingredient && item.ingredient.category) {
        return item.ingredient.category.rank;
      }
      return 0;
    };
  });

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
      if ($scope.listMode === 'planning') {
        item.removed = !item.removed;
        shoppingListService.updateRemoved(item);
      } else {
        item.picked = !item.picked;
        shoppingListService.updatePicked(item);
      }
    };

    $scope.addExtra = function(newItem) {
      console.log('shoppingList.addItem entered.');
      shoppingListService.addExtra(newItem);
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

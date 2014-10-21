'use strict';

angular.module('sldApp')
  .controller('ShoppingListCtrl', function ($scope, $q, scheduleService, ingredientService, mealService, shoppingListService) {

    $scope.shoppingList = []; // The complete list, two parts calculated from schedule and additional stuff.
    $scope.listMode = 'planning';

    $q.all([
      ingredientService.loadIngredients(), shoppingListService.loadShoppingList()
    ]).then(function(value) {
      // Success!
      $scope.ingredients = value[0];
      $scope.shoppingList = value[1];
      $scope.config = shoppingListService.getConfig();
    });

    $scope.toggleListMode = function() {
      $scope.listMode = ($scope.listMode === 'planning' ? 'picking' : 'planning');
    };

    $scope.mainClkAction = function(index) {
      if ($scope.listMode === 'planning') {
        $scope.shoppingList[index].removed = !$scope.shoppingList[index].removed;
        shoppingListService.updateRemoved($scope.shoppingList[index]);
      } else {
        $scope.shoppingList[index].picked = !$scope.shoppingList[index].picked;
        shoppingListService.updatePicked($scope.shoppingList[index]);
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
  });

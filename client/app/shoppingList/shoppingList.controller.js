'use strict';

angular.module('sldApp')
  .controller('ShoppingListCtrl', function ($scope, $q, scheduleService, ingredientService, mealService, shoppingListService) {

    $scope.shoppingList = []; // The complete list, two parts calculated from schedule and additional stuff.
    $scope.additionals = []; // The stuff that is stored in the shopping list in the DB.
    $scope.listMode = 'planning';

    $q.all([
      ingredientService.loadIngredients(), shoppingListService.loadShoppingList()
    ]).then(function(value) {
      // Success!
      $scope.ingredients = value[0];
      $scope.shoppingList = value[1];
//      $scope.timeframe = value[1][1].config.nbrDays;
//      $scope.listMode = value[1][1].config.listMode;
//      shoppingListService.loadIt(3);   // For testing the implementation.
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

/*    $scope.addItemName = function(newName) {
      console.log('addItemName');
      var newItem = { name: newName };
      $scope.ingredients.push(newItem);
      $scope.addItem(newItem);
      $scope.newIngredient = '';
      // TODO: Check that the ingredient is unique
      mealService.createIngredient(newItem);
    };*/

//    $scope.addItem = function (newItem) {
//      $scope.shoppingList.push(newItem);
//    };

/*    $scope.addItem = function(newItem) {
      console.log('shoppingList.addItem entered.');
      if (!$scope.additionals) {
        $scope.additionals = [];
      }
      $scope.additionals.push(newItem); // Detta sparas inte till servicen.
      $scope.shoppingList = shoppingListService.updateShoppingList($scope.timeframe);
      // TODO: Save to database.
    };*/

    $scope.onSelect = function($item/*, $model, $label */) {
      $scope.addItem($item);
    };

    $scope.setTimeframe = function(nbrDays) {
      $scope.timeframe = nbrDays;
      $scope.shoppingList = shoppingListService.updateShoppingList(nbrDays);
    };
  });

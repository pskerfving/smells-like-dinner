'use strict';

angular.module('sldApp')
  .controller('ShoppingListCtrl', function ($scope, $q, scheduleService, ingredientService, mealService, shoppingListService) {

    console.log('Entering ShopplingList Controller');

    $scope.shoppingList = []; // The complete list, two parts calculated from schedule and additional stuff.
    $scope.additionals = []; // The stuff that is stored in the shopping list in the DB.
    $scope.listMode = "planning";

    $q.all([
      ingredientService.loadIngredients(), shoppingListService.loadShoppingList()
    ]).then(function(value) {
      // Success!
      $scope.ingredients = value[0];
      $scope.shoppingList = value[1][0];
      $scope.timeframe = value[1][1].config.nbrDays;
      $scope.listMode = value[1][1].config.listMode;
    });

    $scope.toggleListMode = function() {
      $scope.listMode = ($scope.listMode == "planning" ? "picking" : "planning");
    };

    $scope.mainClkAction = function(index) {
      if ($scope.listMode == "planning") {
        $scope.shoppingList.splice(index, 1);
      } else {
        $scope.shoppingList[index].picked = true;
      }
    };

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

    $scope.onSelect = function($item, $model, $label) {
      $scope.addItem($item);
    };

    $scope.setTimeframe = function(nbrDays) {
      $scope.timeframe = nbrDays;
      $scope.shoppingList = shoppingListService.updateShoppingList(nbrDays);
    };
  });

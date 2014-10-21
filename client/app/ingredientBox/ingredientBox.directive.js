'use strict';

angular.module('sldApp')
  .directive('ingredientBox', function (ingredientService) {
    return {
        templateUrl: 'app/ingredientBox/ingredientBox.html',
        restrict: 'EA',
        scope: {
        callback: '=adder'
      },
      controller : function ($scope) {

        // Load all ingredients and attach to scope.
        ingredientService.loadIngredients().then(function(value) {
          $scope.ingredients = value;
          $scope.newItemName = '';
        });

        $scope.onSelect = function($item/*, $model, $label */) {
          console.log('Directive onSelect() called! : ' + $item.name);
          // The user has selected an item from the dropdown. Now add it to the ng-model.
          $scope.callback($item);
        };

        $scope.addItemBox = function() {
          // The user has entered a new item. Create a new ingredient and add to the list.
          console.log('Directive addItemBox() called! ' + $scope.newItemName);
          var newItem = { name: $scope.newItemName };
          ingredientService.createIngredient(newItem).then(function(result) {
            // SUCESS!
            newItem = result;
            newItem.ingredientid = result._id;
            $scope.ingredients.push(newItem);
            $scope.callback(newItem);
          });
          $scope.newItemName = '';
        };
      }
    };
  });
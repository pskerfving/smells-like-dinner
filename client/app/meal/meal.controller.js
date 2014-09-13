'use strict';

angular.module('sldApp')
  .controller('MealCtrl', function ($scope, $routeParams, mealService) {

    mealService.loadMeals().then(function(value) {
      // Success!
      $scope.meals = value;

      for (var i = 0; i < $scope.meals.length; i++) {
        if ($scope.meals[i]._id === $routeParams.mealId) {
          $scope.meal = $scope.meals[i];
          break;
        }
      }
      if (!$scope.meal) {
        // Redirect to 404
      }

    });

    $scope.addIngredient = function(newIngredientName) {
      if (!$scope.meal.ingredients) {
        $scope.meal.ingredients = [];
      }
      $scope.meal.ingredients.push({ name: newIngredientName });
      $scope.newIngredient = ''; // Is this a good idea to pass it as a parameter AND resetting like this?
      mealService.updateMeal($scope.meal);
    };

    $scope.removeIngredient = function(index) {
      $scope.meal.ingredients.splice(index, 1);
    };

    $scope.saveName = function() {
      $scope.editMeal = false;
      mealService.updateMeal($scope.meal);
    };

    $scope.addSide = function(newSide) {
      if (!$scope.meal.sides) {
        $scope.meal.sides = [];
      }
      $scope.meal.sides.push({ name: newSide });
      $scope.newSide = '';
      mealService.updateMeal($scope.meal);
    };

    $scope.removeSide = function(index) {
      $scope.meal.sides.splice(index, 1);
    };

  });

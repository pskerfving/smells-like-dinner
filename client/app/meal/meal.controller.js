'use strict';

angular.module('sldApp')
  .controller('MealCtrl', function ($scope, $routeParams, mealService, SelectedMealService) {

    $scope.loading = true;

    mealService.loadMeals().then(function(value) {
      // Success!
      $scope.meals = value;
      $scope.loading = false;

      for (var i = 0; i < $scope.meals.length; i++) {
        if ($scope.meals[i]._id === $routeParams.mealId) {
          SelectedMealService.setMeal($scope.meals[i]);
          break;
        }
      }
      if (!$scope.meal) {
        // Redirect to 404
        // Temporarily set to first meal
        SelectedMealService.setMeal($scope.meals[0]);
      }
    });

    $scope.$on('mealSet', function() {
      $scope.meal = SelectedMealService.meal;
    });

    $scope.$watch('meal.ingredients.length', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.meal.empty = ($scope.meal.ingredients.length === 0);
      }
    });

    $scope.addIngredient = function(newIngredient) {
      if (!$scope.meal.ingredients) {
        $scope.meal.ingredients = [];
      }
      $scope.meal.ingredients.push(newIngredient);
      mealService.updateMeal($scope.meal);
    };

    $scope.removeIngredient = function(index) {
      $scope.meal.ingredients.splice(index, 1);
      mealService.updateMeal($scope.meal);
    };

    $scope.saveName = function() {
      $scope.editMeal = false;
      mealService.updateMeal($scope.meal);
    };
  })
  .factory('SelectedMealService', function($rootScope) {
    var selectedMeal = {};

    selectedMeal.setMeal = function (meal) {
      this.meal = meal;
      $rootScope.$broadcast('mealSet');
    };

    return selectedMeal;

  });

'use strict';

angular.module('sldApp')
  .controller('MealListCtrl', function ($scope, $location, mealService) {

    mealService.loadMeals().then(function(value) {
      // Success!
      $scope.meals = value;
    });

    $scope.addMeal = function(newMealTitle) {
      var newMeal = { name: newMealTitle };
      mealService.createMeal(newMeal);
      $scope.meals.push(newMeal);
      $scope.newMealTitle = ''; // Removes the name from the input field.
    };

    $scope.deleteMeal = function(index) {
      mealService.deleteMeal($scope.meals[index]);
      $scope.meals.splice(index, 1);
    };

    $scope.editMeal = function(index) {
      var path = '/meal/' + $scope.meals[index]._id;
      $location.path(path);
    };

  });

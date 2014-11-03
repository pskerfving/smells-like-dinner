'use strict';

angular.module('sldApp')
  .controller('MealListCtrl', function ($scope, $location, mealService) {

    $scope.loading = true;

    mealService.loadMeals().then(function(value) {
      // Success!
      $scope.meals = value;
      $scope.nbrCol = 3;
      $scope.loading = false;
    });

    $scope.addMeal = function(newMealTitle) {
      // TODO: This is not the right place fot this.
      var newMeal = {
        name: newMealTitle,
        ingredients: [],
        sides: [],
        empty: true
      };
      mealService.createMeal(newMeal);
      $scope.meals.push(newMeal);
      $scope.newMealTitle = ''; // Removes the name from the input field.
    };

    $scope.deleteMeal = function(meal) {
      var index = $scope.meals.indexOf(meal);
      mealService.deleteMeal(meal);
      $scope.meals.splice(index, 1);
    };

    $scope.deleteColMeal = function(ci, i) {
      var length = Math.ceil($scope.meals.length / $scope.nbrCol);
      var index = ci * length + i;
      mealService.deleteMeal($scope.meals[index]);
      $scope.meals.splice(index, 1);
    };

    $scope.editMeal = function(index) {
      var path = '/meal/' + $scope.meals[index]._id;
      $location.path(path);
    };

  });

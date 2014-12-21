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
      var ret = mealService.createMeal(newMealTitle);
      $scope.meals.push(ret.meal);
      $scope.newMealTitle = ''; // Removes the name from the input field.
      ret.meal.loading = true;
      ret.promise.then(function() {
        // SUCCESS
        ret.meal.loading = false;
      }, function(err) {
        // FAILURE
        ret.meal.loading = false;
        ret.meal.error = err;
      });
    };

    $scope.deleteMeal = function(meal) {
      meal.loading = true;
      mealService.deleteMeal(meal).then(function() {
        // SUCCESS!
        var index = $scope.meals.indexOf(meal);
        $scope.meals.splice(index, 1);
      }, function() {
        // FAILURE!
        meal.error = 'Misslyckades att ta bort måltiden.'
      });
    };

    $scope.deleteColMeal = function(ci, i) {
      var length = Math.ceil($scope.meals.length / $scope.nbrCol);
      var index = ci * length + i;
      var meal = $scope.meals[index];
      meal.loading = true;
      mealService.deleteMeal(meal).then(function() {
        $scope.meals.splice(index, 1);
      }, function() {
        meal.error = 'Misslyckades att ta bort måltiden.'
      });
    };

    $scope.getItemClasses = function(meal) {
      return [
        meal.loading ? 'loading' : '',
        meal.error ? 'error' : ''
      ];
    };

  });

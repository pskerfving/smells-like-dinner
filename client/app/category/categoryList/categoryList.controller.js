'use strict';

angular.module('sldApp')
  .controller('CategoryListCtrl', function ($scope, categoryService) {
    categoryService.load().then(function (value) {
      // SUCCESS
      $scope.categories = value;
    }, function () {
      // FAILURE
    });

    $scope.addCategory = function(name) {
      var newCat = { name: name };
      $scope.categories.push(newCat);
      $scope.newCategoryName = '';
      categoryService.save(newCat);
    };

    $scope.removeCategory = function(index) {
      var remCat = $scope.categories[index];
      $scope.categories.splice(index, 1);
      categoryService.remove(remCat);
    }
  });

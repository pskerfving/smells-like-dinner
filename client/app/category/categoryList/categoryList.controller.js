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
      var max = 0;
      for (var i = 0; i < $scope.categories.length; i++) {
        max = Math.max(max, $scope.categories[i].rank);
      }
      var newCat = { name: name, rank: max + 1 };
      $scope.categories.push(newCat);
      $scope.newCategoryName = '';
      categoryService.save(newCat);
    };

    $scope.removeCategory = function(cat) {
      $scope.categories.splice($scope.categories.indexOf(cat), 1);
      categoryService.remove(cat);
    };

    $scope.onDropOnCategory = function(catTarget, catDropped) {
      // Recalculate ranking. Between the indexes.
      console.log('target : ', catTarget);
      console.log('dropped : ', catDropped);
      var targetRank = catTarget.rank;
      var droppedRank = catDropped.rank;
      catDropped.rank = catTarget.rank;
      categoryService.update(catDropped);
      for (var i = 0; i < $scope.categories.length; i++) {
        var rank = $scope.categories[i].rank;
        if (!((rank <= targetRank && rank <= droppedRank) || (rank >= targetRank && rank >= droppedRank))) {
          $scope.categories[i].rank += Math.sign(droppedRank - targetRank);
          categoryService.update($scope.categories[i]);
        }
      }
      catTarget.rank += Math.sign(droppedRank - targetRank);
      categoryService.update(catTarget);
    };
  });

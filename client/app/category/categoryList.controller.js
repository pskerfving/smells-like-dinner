'use strict';

angular.module('sldApp')
  .controller('CategoryListCtrl', function ($scope, categoryService) {

    $scope.loading = true;
    $scope.categories = [];

    categoryService.load().then(function (value) {
      // SUCCESS
      $scope.loading = false;
      $scope.categories = value;
    }, function () {
      // FAILURE
    });

    $scope.addCategory = function(name) {
      $scope.newCategoryName = '';
      categoryService.add(name);
    };

    $scope.removeCategory = function(cat) {
      categoryService.remove(cat);
    };

    // Should this be in the service instead of the controller? It is related to the view.
    $scope.onDropOnCategory = function(catTarget, catDropped) {
      // Recalculate ranking. Between the indexes.
      var targetRank = catTarget.rank;
      var droppedRank = catDropped.rank;
      catDropped.rank = catTarget.rank;
      categoryService.update(catDropped);
      for (var i = 0; i < $scope.categories.length; i++) {
        var rank = $scope.categories[i].rank;
        if (!((rank <= targetRank && rank <= droppedRank) || (rank >= targetRank && rank >= droppedRank))) {
          $scope.categories[i].rank += ((droppedRank - targetRank) < 0 ? -1 : 1);
          categoryService.update($scope.categories[i]);
        }
      }
      catTarget.rank += ((droppedRank - targetRank) < 0 ? -1 : 1);
      categoryService.update(catTarget);
    };
  });

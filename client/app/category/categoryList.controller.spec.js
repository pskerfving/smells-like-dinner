'use strict';

describe('Controller: CategoryListCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var CategoryListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategoryListCtrl = $controller('CategoryListCtrl', {
      $scope: scope
    });
  }));

  it('addCategory() should add a new category.', function () {
    // Length of array should be increased.
    var length = scope.categories.length;
    scope.addCategory('Test1');
    expect(scope.categories.length).toEqual(length + 1);
  });

  it('addCategory() new category should have highest rank.', function () {

    // Rank of new item should be max + 1.
    function findMaxRank() {
      var max = 0;
      scope.categories.forEach(function(item) {
        if (item.rank > max) { max = item.rank; }
      });
      return max;
    }

    scope.addCategory('Test1');
    scope.addCategory('Test2');
    expect(scope.categories).toEqual([ { name: 'Test1', rank: 1 }, { name: 'Test2', rank: 2 } ]);
    var max = findMaxRank();
    scope.addCategory('Test3');
    expect(findMaxRank()).toBeGreaterThan(max);
  });

  it('remove() should remove the category', function () {
    var test1 = scope.addCategory('Test1');
    var test2 = scope.addCategory('Test2');
    var test3 = scope.addCategory('Test3');
    scope.removeCategory(test2);
    expect(scope.categories).toEqual([ { name: 'Test1', rank: 1 }, { name: 'Test3', rank: 3 } ]);
  });

});

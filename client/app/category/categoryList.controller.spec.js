'use strict';

describe('Controller: CategoryListCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var CategoryListCtrl, scope, httpBackend, testResponse;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    testResponse = [
      { name: 'TestCat1', rank: 1 },
      { name: 'TestCat2', rank: 2 },
      { name: 'TestCat3', rank: 3 },
      { name: 'TestCat4', rank: 4 },
      { name: 'TestCat5', rank: 5 }
    ];
    httpBackend.whenGET('/api/categories').respond(200, testResponse);
    httpBackend.whenPOST('/api/categories').respond(201, { name: 'TestCat6', rank: 6 });
    CategoryListCtrl = $controller('CategoryListCtrl', {
      $scope: scope
    });
  }));

  //afterEach(function() {
  //  httpBackend.verifyNoOutstandingExpectation();
  //  httpBackend.verifyNoOutstandingRequest();
  //});

  it('should load an array of categories', function() {
    expect(scope.categories).toEqual([]);
    httpBackend.flush();
    expect(scope.categories.length).toEqual(5);
  });

  it('addCategory() should add a new category.', function () {
    // Length of array should be increased.
    httpBackend.flush();
    var length = scope.categories.length;
    scope.addCategory('Test6');
    expect(scope.categories.length).toEqual(length + 1);
    httpBackend.flush();
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

    httpBackend.flush();
    var max = findMaxRank();
    scope.addCategory('Test6');
    expect(findMaxRank()).toEqual(max + 1);
  });

  it('comparing arrays of objects', function() {
    var a = [1, 2, 3];
    expect(a).toEqual([1, 2, 3]);
    var b = [ { num: 1, name: 'Hej' }, { num: 2 }, { num: 3 }];
    expect(b).toEqual([ { num: 1, name: 'Hej' }, { num: 2 }, { num: 3 }]);
  });

  it('remove() should remove the category', function () {
    httpBackend.flush();
    expect(angular.equals(scope.categories, testResponse)).toBeTruthy();
    scope.removeCategory(scope.categories[2]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat1', rank: 1 },
      { name: 'TestCat2', rank: 2 },
      { name: 'TestCat4', rank: 4 },
      { name: 'TestCat5', rank: 5 }
    ])).toBeTruthy();
    scope.removeCategory(scope.categories[0]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat2', rank: 2 },
      { name: 'TestCat4', rank: 4 },
      { name: 'TestCat5', rank: 5 }
    ])).toBeTruthy();
    scope.removeCategory(scope.categories[2]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat2', rank: 2 },
      { name: 'TestCat4', rank: 4 }
    ])).toBeTruthy();
  });


  it('should support reordering of categories', function() {
    httpBackend.flush();
    scope.onDropOnCategory(scope.categories[1], scope.categories[3]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat1', rank: 1 },
      { name: 'TestCat2', rank: 3 },
      { name: 'TestCat3', rank: 4 },
      { name: 'TestCat4', rank: 2 },
      { name: 'TestCat5', rank: 5 }
    ])).toBeTruthy();
    scope.onDropOnCategory(scope.categories[0], scope.categories[4]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat1', rank: 2 },
      { name: 'TestCat2', rank: 4 },
      { name: 'TestCat3', rank: 5 },
      { name: 'TestCat4', rank: 3 },
      { name: 'TestCat5', rank: 1 }
    ])).toBeTruthy();
    scope.onDropOnCategory(scope.categories[1], scope.categories[0]);
    expect(angular.equals(scope.categories, [
      { name: 'TestCat1', rank: 4 },
      { name: 'TestCat2', rank: 3 },
      { name: 'TestCat3', rank: 5 },
      { name: 'TestCat4', rank: 2 },
      { name: 'TestCat5', rank: 1 }
    ])).toBeTruthy();
  });
});

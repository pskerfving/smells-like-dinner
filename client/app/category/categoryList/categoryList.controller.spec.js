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

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

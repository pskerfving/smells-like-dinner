'use strict';

describe('Controller: CategorylistCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var CategorylistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategorylistCtrl = $controller('CategorylistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: ShoppinglistCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var ShoppinglistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShoppinglistCtrl = $controller('ShoppinglistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: MeallistCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var MeallistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MeallistCtrl = $controller('MeallistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

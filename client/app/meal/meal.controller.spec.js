'use strict';

describe('Controller: MealCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var MealCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealCtrl = $controller('MealCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

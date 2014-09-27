'use strict';

describe('Controller: UpcomingscheduleCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var UpcomingscheduleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UpcomingscheduleCtrl = $controller('UpcomingscheduleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: AcceptInviteCtrl', function () {

  // load the controller's module
  beforeEach(module('sldApp'));

  var AcceptInviteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AcceptInviteCtrl = $controller('AcceptInviteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

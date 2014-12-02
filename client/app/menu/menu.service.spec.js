'use strict';

describe('Service: menuService', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var menu;
  beforeEach(inject(function (_menuService_) {
    menu = _menuService_;
  }));

  it('should do something', function () {
    expect(!!menu).toBe(true);
  });

});

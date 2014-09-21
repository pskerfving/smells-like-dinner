'use strict';

describe('Service: shoppinglist', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var shoppinglist;
  beforeEach(inject(function (_shoppingListService_) {
    shoppinglist = _shoppingListService_;
  }));

  it('should do something', function () {
    expect(!!shoppinglist).toBe(true);
  });

});

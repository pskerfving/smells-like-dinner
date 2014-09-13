'use strict';

describe('Service: shoppinglist', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var shoppinglist;
  beforeEach(inject(function (_shoppinglist_) {
    shoppinglist = _shoppinglist_;
  }));

  it('should do something', function () {
    expect(!!shoppinglist).toBe(true);
  });

});

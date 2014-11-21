'use strict';

describe('Service: invite', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var invite;
  beforeEach(inject(function (_invite_) {
    invite = _invite_;
  }));

  it('should do something', function () {
    expect(!!invite).toBe(true);
  });

});

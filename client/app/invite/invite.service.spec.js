'use strict';

describe('Service: inviteService', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var invite;
  beforeEach(inject(function (_inviteService_) {
    invite = _inviteService_;
  }));

  it('should do something', function () {
    expect(!!invite).toBe(true);
  });

});

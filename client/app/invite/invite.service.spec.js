'use strict';

describe('Service: inviteService', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var invite;
  beforeEach(inject(function (_inviteService_) {
    invite = _inviteService_;
  }));

  it('loadInvites() should return a promise', function () {
    var promise = invite.loadInvites();
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

});

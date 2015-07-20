'use strict';

describe('Service: inviteService', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var invite;
  var auth;
  var httpBackend;

  beforeEach(inject(function (_inviteService_, _Auth_, $httpBackend) {
    invite = _inviteService_;
    auth = _Auth_;
    httpBackend = $httpBackend;
    httpBackend.whenPOST('/auth/local').respond(200, { token: 'this_is_a_token' } );
    httpBackend.whenGET('/users/me').respond(200, {
      name: 'Test User',
      email: 'test@test.com',
      role: user,
      friends_id: {},
      meals_id: {},
      schedule_id: 'UNDEFINED',
      own_schedule_id: 'UNDEFINED'
    });
    httpBackend.whenGET('/api/invites/me').respond(200, [
        {
          inviter_name: 'Test User 2',
          inviter_id: 'test_user2_id',
          invitee_email: 'test@test.com',
          invitee_id: 'test_user1_id',
          schedule_id: 'shared_schedule_id',
          expired: false
        }
      ]);
  }));

  it('loadInvites() should return a promise', function () {
    var promise = invite.loadInvites();
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

  it('acceptInvite() should set the schedule_id of the user to the one from the invite', function() {
    var promise = auth.login({ email: 'test@test.com', password: 'pw' });
    httpBackend.flush();
    promise.then(function() {
      promise = invite.loadInvites();
      httpBackend.flush();
      promise.then(function(data) {
//        expect(data.);
      })
    });
  });

});

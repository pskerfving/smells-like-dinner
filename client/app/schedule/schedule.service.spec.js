'use strict';

describe('Service: schedule', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var schedule;
  beforeEach(inject(function (_scheduleService_) {
    schedule = _scheduleService_;
  }));

  it('should do something', function () {
    expect(!!schedule).toBe(true);
  });

});

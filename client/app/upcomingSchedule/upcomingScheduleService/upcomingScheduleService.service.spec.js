'use strict';

describe('Service: upcomingScheduleService', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var upcomingScheduleService;
  beforeEach(inject(function (_upcomingScheduleService_) {
    upcomingScheduleService = _upcomingScheduleService_;
  }));

  it('should do something', function () {
    expect(!!upcomingScheduleService).toBe(true);
  });

});

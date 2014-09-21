'use strict';

describe('Service: meal', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var meal;
  beforeEach(inject(function (_mealService_) {
    meal = _mealService_;
  }));

  it('should do something', function () {
    expect(!!meal).toBe(true);
  });

});

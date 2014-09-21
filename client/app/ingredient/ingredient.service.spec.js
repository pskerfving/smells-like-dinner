'use strict';

describe('Service: ingredient', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var ingredient;
  beforeEach(inject(function (_ingredientService_) {
    ingredient = _ingredientService_;
  }));

  it('should do something', function () {
    expect(!!ingredient).toBe(true);
  });

});

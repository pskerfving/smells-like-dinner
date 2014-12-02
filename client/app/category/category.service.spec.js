'use strict';

describe('Service: category', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var category;
  beforeEach(inject(function (_categoryService_) {
    category = _categoryService_;
  }));

  it('should do something', function () {
    expect(!!category).toBe(true);
  });

});

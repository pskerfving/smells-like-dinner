'use strict';

describe('Service: category', function ($http) {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var category;
  beforeEach(inject(function (_categoryService_) {
    category = _categoryService_;
  }));

  it('load() should return a promise', function () {
    var promise = category.load();
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

  it('save() should return a promise', function () {
    var test1 = { name: 'TestCat1', rank: 1 };
    var promise = category.save(test1);
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

});

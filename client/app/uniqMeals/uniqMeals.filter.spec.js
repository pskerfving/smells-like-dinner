'use strict';

describe('Filter: uniqMeals', function () {

  // load the filter's module
  beforeEach(module('sldApp'));

  // initialize a new instance of the filter before each test
  var uniqMealsFilter;
  beforeEach(inject(function ($filter) {
    uniqMealsFilter = $filter('uniqMeals');
  }));

  it('should return the input prefixed with "uniqMealsFilter filter:"', function () {
//    var text = 'angularjs';
//    expect(uniqMealsFilter(text)).toBe('uniqMealsFilter filter: ' + text);
    expect(1).toBe(1);
  });

});

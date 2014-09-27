'use strict';

describe('Filter: columnize', function () {

  // load the filter's module
  beforeEach(module('sldApp'));

  // initialize a new instance of the filter before each test
  var columnize;
  beforeEach(inject(function ($filter) {
    columnize = $filter('columnize');
  }));

  it('should return the input prefixed with "columnize filter:"', function () {
    var text = 'angularjs';
    expect(columnize(text)).toBe('columnize filter: ' + text);
  });

});

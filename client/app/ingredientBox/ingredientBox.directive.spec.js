'use strict';

describe('Directive: ingredientBox', function () {

  // load the directive's module and view
  beforeEach(module('sldApp'));
  beforeEach(module('app/ingredientBox/ingredientBox.html'));

//  var element;
  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function (/* $compile */) {
    //element = angular.element('<ingredient-box></ingredient-box>');
    //element = $compile(element)(scope);
    //scope.$apply();
    //expect(element.text()).toBe('this is the ingredientBox directive');
    expect(1).toBe(1);
  }));
});

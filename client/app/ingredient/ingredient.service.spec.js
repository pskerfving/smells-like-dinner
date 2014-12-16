'use strict';

describe('Service: ingredient', function () {

  // load the service's module
  beforeEach(module('sldApp'));

  // instantiate service
  var ingredient, httpBackend;
  beforeEach(inject(function (_ingredientService_, $httpBackend) {
    ingredient = _ingredientService_;
    httpBackend = $httpBackend;
    httpBackend.whenGET('/api/ingredients').respond(200,
      [
        { name: 'Test1' },
        { name: 'Test2', category_id: '2' },
        { name: 'Test3', category_id: '1' }
      ]);
    // The service will also call for categories.
    httpBackend.whenGET('/api/categories').respond(200,
      [
        { _id: '1', name: 'TestCat1', rank: 1 },
        { _id: '2', name: 'TestCat2', rank: 2 },
        { _id: '3', name: 'TestCat3', rank: 3 },
        { _id: '4', name: 'TestCat4', rank: 4 },
        { _id: '5', name: 'TestCat5', rank: 5 }
      ]);
  }));

  //afterEach(function() {
  //  httpBackend.verifyNoOutstandingExpectation();
  //  httpBackend.verifyNoOutstandingRequest();
  //});

  it('loadIngredients() should return a promise', function () {
    var promise = ingredient.loadIngredients();
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

  it('createIngredient() should return a promise', function () {
    var test1 = { name: 'TestIngredient'};
    var promise = ingredient.createIngredient(test1);
    expect(promise.hasOwnProperty('then')).toBe(true);
  });

  it('updateIngredient() should return a promise', function () {
    var promise = ingredient.loadIngredients();
    httpBackend.flush();
    promise.then(function() {
      expect(ingredient.cache.length).toBeGreaterThan(0);
      ingredient.cache[0].name = 'TestUpdate';
      var promise = ingredient.updateIngredient(ingredient.cache[0]);
      expect(promise.hasOwnProperty('then')).toBe(true);
    });
  });

  it('loadIngredient() should map categories to the ingredients', function () {
    var promise = ingredient.loadIngredients();
    httpBackend.flush();
    promise.then(function() {
      expect(ingredient.cache[0].category).toBeUndefined();
      expect(ingredient.cache[1].category.name).toEqual('TestCat2');
      expect(ingredient.cache[2].category.name).toEqual('TestCat1');
    });
  });

});

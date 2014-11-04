'use strict';

angular.module('sldApp')
  .service('categoryService', function ($q, $resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var Category = $resource('/api/categories/:id', { id: '@_id' }, { update: { method:'PUT' } });
    var deferred;

    this.load = function() {
      console.log('loading categories');
      if (deferred) { return deferred.promise; }
      else {
        deferred = $q.defer();
      }
      Category.query(function(data) {
        cache = data;
        deferred.resolve(cache);
      }, function(errResponse) {
        console.log('something went wrong fetching the categories.', errResponse);
        // TODO. Something is wrong with the error handling further up the line.
        deferred.reject();
      });
      return deferred.promise;
    };

    this.save = function(cat) {
      console.log('saving category: ', cat.name);
      Category.save(cat, function(response) {
        cat._id = response._id;
      });
    };

    this.update = function(cat) {
      var deferred = $q.defer();
      Category.update(cat, function(response) {
        // SUCCESS
        cat._id = response._id;
        deferred.resolve(cat);
        console.log('saved category to DB successfully.');
      }, function(errResponse) {
        //FAILURE
        deferred.reject(errResponse);
        console.log('failure saving category to DB: ', errResponse);
      });
      return deferred.promise;
    };

    this.remove = function(cat) {
      var deferred = $q.defer();
      Category.delete({id: cat._id}, function(response) {
        // SUCESS
        deferred.resolve();
        console.log('success!', response);
      }, function(err) {
        // FAILURE
        deferred.reject(err);
        console.log('failure!', err);

      });
      return deferred.promise;
    };
  });

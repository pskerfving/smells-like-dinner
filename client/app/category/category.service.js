'use strict';

angular.module('sldApp')
  .service('categoryService', function ($q, $resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var Category = $resource('/api/categories/:id', { id: '@_id' } );
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
      console.log('saving new category: ', cat.name);
      Category.save(cat, function(response) {
        cat._id = response._id;
      });
    };

    this.remove = function(cat) {
      console.log('deleting category: ', cat.name);
      Category.delete({id: cat._id}, function(response) {
        // SUCESS
        console.log('success!', response);

      }, function(err) {
        // FAILURE
        console.log('failure!', err);

      });
    };
  });

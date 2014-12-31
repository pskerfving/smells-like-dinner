'use strict';

angular.module('sldApp')
  .service('categoryService', function ($q, $resource, socket) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache = [];
    var Category = $resource('/api/categories/:id', { id: '@_id' }, { update: { method:'PUT' } });
    var deferred;

    socket.syncUpdates('category', cache);

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
      var deferred = $q.defer();
      Category.save(cat, function(response) {
        // SUCCESS
        console.log('saved category: ', cat.name);
        cat._id = response._id;
        deferred.resolve(cat);
      }, function(err) {
        console.log('saving category failed : ', err);
      });
      return deferred.promise;
    };

    this.update = function(cat) {
      var deferred = $q.defer();
      Category.update(cat, function(response) {
        // SUCCESS
        cat._id = response._id;
        deferred.resolve(cat);
      }, function(errResponse) {
        //FAILURE
        deferred.reject(errResponse);
        console.log('failure saving category to DB: ', errResponse);
      });
      return deferred.promise;
    };

    this.add = function(name) {
      var max = 0;
      for (var i = 0; i < cache.length; i++) {
        max = Math.max(max, cache[i].rank);
      }
      var newCat = { name: name, rank: max + 1 };
      cache.push(newCat);
      return this.save(newCat);
    };

    this.remove = function(cat) {
      var deferred = $q.defer();
      cache.splice(cache.indexOf(cat), 1);
      Category.delete({id: cat._id}, function() {
        // SUCCESS
        deferred.resolve();
      }, function(err) {
        // FAILURE
        console.log('Failure to delete category in DB!', err);
        deferred.reject(err);
      });
      return deferred.promise;
    };

  });

'use strict';

angular.module('sldApp')
  .service('inviteService', function ($q, $resource, $rootScope, Auth) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var cache;
    var deferred;
    var Invite = $resource('/api/invites/:id/:controller', { id: '@_id' }, {
      accept: {
        method: 'PUT',
        params: {
          controller:'accept'
        }
      },
      update: { method:'PUT' } });
    var InviteMe = $resource('/api/invites/me');


    this.loadInvites = function() {
      return loadInvitesPrivate();
    };

    function loadInvitesPrivate() {
      console.log('LOADING INVITES');
      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      InviteMe.query(function(value) {
        console.log('INVITES : ', value);
        if (cache) {
          emptyCache();
          copyInvites(value);
        } else {
          cache = value;
        }
        deferred.resolve(cache);
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function emptyCache() {
      while (cache.length > 0) {
        cache.pop();
      }
    }

    function copyInvites(value) {
      for (var i = 0; i < value.length; i++) {
        cache.push(value[i]);
      }
    }

    this.createInvite = function(newInvite) {
      console.log('CREATING INVITE', newInvite);
      Invite.save(newInvite, function() {
        // SUCCESS
        console.log('successfully created');
      }, function() {
        // FAILURE
      });
    };

    this.saveInvite = function(invite) {
      var deferred = $q.defer();
      Invite.update(invite, function() {
        // SUCESS
        deferred.resolve();
      }, function(err) {
        // FAILED
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.acceptInvite = function(invite) {
      var deferred = $q.defer();
      Invite.accept(invite, function() {
        deferred.resolve(invite);
      }, function(err) {
        // FAIL!
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $rootScope.$on('userLoggedInOut', function() {
      if (Auth.isLoggedIn()) {
        deferred = undefined;
        loadInvitesPrivate();
      } else {
        emptyCache();
      }
    });

  });

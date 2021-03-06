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
      update: { method:'PUT' },
      getMe: {
        method: 'GET',
        url: '/api/invites/me',
        isArray: true
      }
    });


    this.loadInvites = function() {
      return loadInvitesPrivate();
    };

    function loadInvitesPrivate() {
      console.log('LOADING INVITES');
      if (deferred) {
        return deferred.promise;
      }
      deferred = $q.defer();
      Auth.isLoggedInAsync(function(loggedIn) {
        // Only load the invites if the user is logged in.
        // Wait until the client has received a token.
        if (loggedIn) {
          Invite.getMe(function(value) {
            console.log('INVITES : ', value);
            if (cache) {
              emptyCache();
              copyInvites(value);
            } else {
              cache = value;
            }
            deferred.resolve(cache);
          }, function(err) {
            // FAILURE to get invites from backend.
            console.log('Failed to get invites from : ', err);
            deferred.reject(err);
          });
        } else {
          // The user logged out. Empty the cache.
          if (cache) {
            emptyCache();
          } else {
            cache = [];
          }
          deferred.resolve(cache);
        }
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
        var user = Auth.getCurrentUser();
        user.schedule_id = invite.schedule_id;
        deferred.resolve(invite);
      }, function(err) {
        // FAIL!
        deferred.reject(err);
      });
      return deferred.promise;
    };

    $rootScope.$on('userLoggedInOut', function() {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          deferred = undefined;
          loadInvitesPrivate();
        } else {
          emptyCache();
        }
      });
    });

  });

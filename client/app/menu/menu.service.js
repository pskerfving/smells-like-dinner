'use strict';

angular.module('sldApp')
  .factory('menuService', function () {
    return {
      menu: [],
      setMenu: function(newMenu) {
        angular.copy(newMenu, this.menu);
      }
    };
  });

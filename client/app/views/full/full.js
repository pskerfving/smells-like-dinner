'use strict';

angular.module('sldApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/full/full.html',
        controller: 'FullViewCtrl'
      });
  })
  .controller('FullViewCtrl', function(menuService) {
    menuService.setMenu([
      {
        title: '1. Måltider',
        link: '#meals'
      }, {
        title: '2. Schema',
        link: '#shcdule'
      }, {
        title: '3. Ingredienser',
        link: '#ingredients'
      }, {
        title: '4. Inköp',
        link: '#shoppinglist'
      }]);
    });

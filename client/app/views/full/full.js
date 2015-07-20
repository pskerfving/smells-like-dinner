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
        link: 'meals',
        anchor: true
      }, {
        title: '2. Schema',
        link: 'schedule',
        anchor: true
      }, {
        title: '3. Ingredienser',
        link: 'ingredients',
        anchor: true
      }, {
        title: '4. Inköp',
        link: 'shoppinglist',
        anchor: true
      }]);
    });

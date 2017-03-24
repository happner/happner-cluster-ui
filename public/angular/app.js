'use strict';

/* App Module */

var happnerApp = angular.module('happnerApp', [
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  //'ngDragDrop',
  'ngScrollTop',
  'ui.bootstrap',
  'rt.select2',
  'happner',
  'angular-json-editor',
  'happnerServices',
  'happnerControllers',
  'angularMoment',
  'luegg.directives',
  'ng.tv4',
  'anguFixedHeaderTable',
  'ngPluralizeFilter'
]);

happnerApp.config(function (JSONEditorProvider, $locationProvider, $routeProvider) {

  // these are set by default, but we set this for demonstration purposes
  JSONEditorProvider.configure({
    defaults: {
      options: {
        iconlib: 'bootstrap3',
        theme: 'bootstrap3'
      }
    }
  });

  $routeProvider

  // route for the home page
    .when('/', {
      templateUrl : './angular/templates/dashboard.html'
    })

    .when('/dashboard', {
      templateUrl : './angular/templates/dashboard.html'
    })

    .when('/peers', {
      templateUrl : './angular/templates/peers.html'
    })
  ;

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});

happnerApp.run(function($rootScope) {
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    console.log('route changing:::', event);
  });
});


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

    .when('/', {
      templateUrl : '/system/templates/dashboard.html'
    })

    .when('/dashboard', {
      templateUrl : '/system/templates/dashboard.html'
    })

    .when('/cluster/edit/:id', {
      templateUrl : '/cluster/templates/cluster_edit.html'
    })

    .when('/cluster/peer/dashboard', {
      templateUrl : '/cluster/templates/peer_dashboard.html'
    })

    .when('/cluster/peer/search', {
      templateUrl : '/cluster/templates/peer_search.html'
    })

    .when('/peers', {
      templateUrl : '/cluster/templates/peer_search.html'
    })

    .when('/cluster/peer/edit/:id', {
      templateUrl : '/cluster/templates/peer_edit.html'
    })

    .when('/cluster/search', {
      templateUrl : '/cluster/templates/cluster_search.html'
    })

    .when('/cluster', {
      templateUrl : '/cluster/templates/cluster_search.html'
    })

    .when('/clusters', {
      templateUrl : '/cluster/templates/cluster_search.html'
    })

    .when('/warehouse', {
      templateUrl : './warehouse/templates/warehouse_search.html'
    })

    .when('/warehouse/search', {
      templateUrl : './warehouse/templates/warehouse_search.html'
    })

    .when('/warehouse/edit/:id', {
      templateUrl : './warehouse/templates/warehouse_edit.html'
    })

    .when('/assemblyline', {
      templateUrl : './assemblyline/templates/assemblyline_search.html'
    })

    .when('/assemblyline/edit/:id', {
      templateUrl : './assemblyline/templates/assemblyline_edit.html'
    })

    /*
     <li><a href="/warehouse/edit/new">new warehouse</a>
     </li>
     <li><a href="/warehouse/search">search warehouses</a>
     </li>
     <li><a href="/warehouse/schema/edit/new">new schema</a>
     </li>
     <li><a href="/warehouse/schema/search">search schemas</a>
     </li>
     <li><a href="/warehouse/object/edit/new">new object</a>
     </li>
     <li><a href="/warehouse/object/search">search objects</a>
     </li>
     <li><a href="/warehouse/report/edit/new">new report</a>
     </li>
     <li><a href="/warehouse/report/search">search reports</a>
     </li>
     */

    .when('/warehouse/search', {
      templateUrl : './warehouse/templates/warehouse_search.html'
    })

    .when('/warehouse/edit/:id', {
      templateUrl : './warehouse/templates/warehouse_edit.html'
    })

    .when('/warehouse/schema/search', {
      templateUrl : './warehouse/templates/schema_search.html'
    })

    .when('/warehouse/schema/edit/:id', {
      templateUrl : './warehouse/templates/schema_edit.html'
    })

    .when('/warehouse/object/search', {
      templateUrl : './warehouse/templates/object_search.html'
    })

    .when('/warehouse/object/edit/:id', {
      templateUrl : './warehouse/templates/object_edit.html'
    })

    .when('/warehouse/report/search', {
      templateUrl : './warehouse/templates/report_search.html'
    })

    .when('/warehouse/report/edit/:id', {
      templateUrl : './warehouse/templates/report_edit.html'
    })

    .when('/assemblyline/directive/search', {
      templateUrl : './assemblyline/templates/directive_search.html'
    })

    .when('/assemblyline/directive/edit/:id', {
      templateUrl : './assemblyline/templates/directive_edit.html'
    })

    .when('/assemblyline/control/search', {
      templateUrl : './assemblyline/templates/control_search.html'
    })

    .when('/assemblyline/control/edit/:id', {
      templateUrl : './assemblyline/templates/control_edit.html'
    })

    .when('/assemblyline/droid/edit/:id', {
      templateUrl : './assemblyline/templates/droid_edit.html'
    })

    .when('/assemblyline/droid/search', {
      templateUrl : './assemblyline/templates/droid_search.html'
    })

    .when('/assemblyline/blueprint/edit/:id', {
      templateUrl : './assemblyline/templates/blueprint_edit.html'
    })

    .when('/assemblyline/blueprint/search', {
      templateUrl : './assemblyline/templates/blueprint_search.html'
    })

    .when('/assemblyline/site/edit/:id', {
      templateUrl : './assemblyline/templates/site_edit.html'
    })

    .when('/assemblyline/site/search', {
      templateUrl : './assemblyline/templates/site_search.html'
    })

    .when('/assemblyline/project/edit/:id', {
      templateUrl : './assemblyline/templates/project_edit.html'
    })

    .when('/assemblyline/project/search', {
      templateUrl : './assemblyline/templates/project_search.html'
    })

    .when('/assemblyline/factory/edit/:id', {
      templateUrl : './assemblyline/templates/factory_edit.html'
    })

    .when('/assemblyline/factory/search', {
      templateUrl : './assemblyline/templates/factory_search.html'
    })

    .when('/organisation', {
      templateUrl : './organisation/templates/organisation_search.html'
    })

    .when('/organisation/search', {
      templateUrl : './organisation/templates/organisation_search.html'
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


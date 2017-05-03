'use strict';

/* App Module */

var happnerApp = angular.module('happnerApp', [
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'ngDragDrop',
  'ngScrollTop',
  'ui.bootstrap',
  'rt.select2',
  'happner',
  'angular-json-editor',
  'happnerServices',
  'happnerControllers',
  'angularBootstrapNavTree',
  'ideFilters',
  'ui.ace',
  'ui.jsPlumb',
  'angularMoment',
  'luegg.directives',
  'ng.tv4',
  'anguFixedHeaderTable',
  'ngPluralizeFilter'
]);

happnerApp.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});

happnerApp.directive ('compileHtml', function($compile) {
return  {
  restrict: 'A',
  scope: { compileHtml : '=' },
  replace: true,
  link: function (scope, element, attrs) {
    console.log(element);
    console.log(element);

    scope.$watch('compileHtml', function(html) {
      element.html(html);
      $compile(element.contents())(scope.$parent.$parent);
    });
  }
}});

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

    // route for the about page
    .when('/warehouse/schema/search', {
      templateUrl : '/warehouse/templates/data-search.html',
      controller:'DataSchemaSearchController'
    })

    .when('/warehouse/schema/edit/:type', {
      templateUrl: function(urlattr){
        return  '/warehouse/templates/schema-edit.html?type=' + (urlattr.type?urlattr.type:'new');
      }
    })

    .when('/warehouse/data/:type/search', {
      templateUrl: function(urlattr){
        return '/warehouse/templates/data-search.html?type=' + urlattr.type;
      },
      controller:'DataSearchController'
    })

    .when('/warehouse/data/:type/edit/:id', {
      templateUrl: function(urlattr){
        return "/warehouse/templates/data-edit.html?type=" + urlattr.type + '&id=' + (urlattr.id?urlattr.id:'new');
      }
    })

    // .when('/warehouse/search', {
    //   templateUrl : './warehouse/templates/warehouse_search.html'
    // })
    //
    // .when('/warehouse/edit/:id', {
    //   templateUrl : './warehouse/templates/warehouse_edit.html'
    // })
    //
    // .when('/warehouse/schema/search', {
    //   templateUrl : './warehouse/templates/schema_search.html'
    // })
    //
    // .when('/warehouse/schema/edit/:id', {
    //   templateUrl : './warehouse/templates/schema_edit.html'
    // })
    //
    // .when('/warehouse/object/search', {
    //   templateUrl : './warehouse/templates/object_search.html'
    // })
    //
    // .when('/warehouse/object/edit/:id', {
    //   templateUrl : './warehouse/templates/object_edit.html'
    // })

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

happnerApp.factory('AppSession', function($rootScope) {
  return {
    //currently what path are we editing
    currentPath: '',
    currentLocation:{
      history:[]
    },
    eventListeners:{//stored as [controllerName][listenerName]

    },
    //data that is being currently edited, keyed by the path of the item
    dirty:{},
    //used rootscope to push an event throughout the app
    broadcastEvent: function(event, args) {
      $rootScope.$broadcast(event, args);
    },
    defaultDirectiveCode:'LyoNCg0KVGhlIHByb2Mgb2JqZWN0IGdpdmVzIHlvdSBhY2Nlc3MgdG8gc3lzdGVtIGhlbHBlciBmdW5jdGlvbnMuDQpUaGUgcGFyYW1zIGFyZSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgaW50byB0aGlzIG9wZXJhdGlvblQNClRoZSBsaW5lIGlzIHRoZSByYXcgbGluZSB0byBiZSBwcm9jZXNzZWQNCkFmdGVyIHRoZSBsaW5lIGhhcyBiZWVuIHRyYW5zZm9ybWVkIG9yIGNoZWNrZWQsIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkIHRvIHBhc3MgdGhlIGxpbmUgYWxvbmcgdGhlIHByb2Nlc3MNCiovDQoNCmZ1bmN0aW9uIHBlcmZvcm0ocHJvYywgcGFyYW1zLCBsaW5lLCBjYWxsYmFjayl7DQogICAgDQogICAgY2FsbGJhY2soJ09LJywgbGluZSk7DQp9',
    defaultControlCode:'PCEtLSBUaGlzIGlzIHRoZSBzb3VyY2UgZm9yIHlvdXIgY29udHJvbHMsIGFzIHlvdSBjYW4gc2VlIHdlIGFyZSB1c2luZyBuZy1tb2RlbCB0byBsaW5rIHRoZSB1c2VyIGlucHV0IHRvIHRoZSBhY3R1YWwgcGFyYW1ldGVycyB1c2VkIGZvciB0aGUgb3JjaGVzdHJhdGlvbiAtLT4NCg0KPGZvcm0gY2xhc3M9ImZvcm0taG9yaXpvbnRhbCIgcm9sZT0iZm9ybSI+DQogIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiPg0KICAgPGxhYmVsIGZvcj0iY29udHJvbFBhcmFtMSIgY2xhc3M9ImNvbC1zbS0yIGNvbnRyb2wtbGFiZWwiPlBhcmFtZXRlciAxPC9sYWJlbD4NCiAgIDxkaXYgY2xhc3M9ImNvbC1zbS0xMCI+DQogICAgICA8aW5wdXQgY2xhc3M9ImZvcm0tY29udHJvbCIgaWQ9ImNvbnRyb2xQYXJhbTEiIHBsYWNlaG9sZGVyPSJOYW1lIiBuZy1tb2RlbD0icGFyYW1zLlBhcmFtMSI+PC9pbnB1dD4NCiAgICA8L2Rpdj4NCiAgPC9kaXY+DQogICA8ZGl2IGNsYXNzPSJmb3JtLWdyb3VwIj4NCiAgIDxsYWJlbCBmb3I9ImNvbnRyb2xQYXJhbTIiIGNsYXNzPSJjb2wtc20tMiBjb250cm9sLWxhYmVsIj5QYXJhbWV0ZXIgMjwvbGFiZWw+DQogICA8ZGl2IGNsYXNzPSJjb2wtc20tMTAiPg0KICAgICAgPGlucHV0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIGlkPSJjb250cm9sUGFyYW0yIiBwbGFjZWhvbGRlcj0iTmFtZSIgbmctbW9kZWw9InBhcmFtcy5QYXJhbTIiPjwvaW5wdXQ+DQogICAgPC9kaXY+DQogIDwvZGl2Pg0KIDwvZm9ybT4='
  };
});

happnerApp.run(function($rootScope) {

});



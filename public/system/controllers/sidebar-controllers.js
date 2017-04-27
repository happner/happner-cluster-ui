
happnerControllers.controller('SidebarEditController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4',
  function ($scope, $rootScope, $compile, $q, dataService, tv4) {

  }
]);


happnerControllers.controller('SidebarDisplayController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4',
  function ($scope, $rootScope, $compile, $q, dataService, tv4) {

    $scope.sideBar = {};

    dataService.get('/system/app_schemas/*', function(e, schemas){

      if (e) return $rootScope.notify('unable to list sidebar');

      schemas.forEach(function(schema){

        if (schema.sidebar && schema.sidebar.display){

          var group;

          if (schema.sidebar.group && schema.sidebar.group != 'self') {
            if (!$scope.sideBar[schema.sidebar.group]) $scope.sideBar[schema.sidebar.group] = {icon:schema.icon,items:[]};
            group = $scope.sideBar[schema.sidebar.group];
          } else {
            if (!$scope.sideBar[schema.title]) $scope.sideBar[schema.title] = {icon:schema.icon,items:[]};
            group = $scope.sideBar[schema.title];
          }

          if (schema.allow_create) group.items.push({key:schema.title, label:'new'});
          if (schema.allow_search) group.items.push({key:schema.title, label:'search'});

        }
      });

      $scope.$apply();
    });
  }
]);

happnerControllers.controller('DashboardController', ['$scope', 'dataService', '$rootScope', function ($scope, dataService, $rootScope) {

  var tryApply = function(){
    try{
      $scope.$apply();
    }catch(e){

    }
  };

  $scope.resetDashboardData = function(){
    $scope.dashboardData = {
      restarts:0,
      uptime:Date.now(),
      errors:0,
      load:0,
      last10items:[]
    };
  };

  $scope.managedItems = {};

  $scope.insertLastItem = function(item){

    var itemProp = {name:item.name, path:item._meta.path, when:item._meta.modified};

    var pathSegments = item._meta.path.split('/');
    itemProp.id = pathSegments[pathSegments.length - 1];

    if ($scope.dashboardData.last10items.length >= 10) $scope.dashboardData.last10items.pop();

    $scope.dashboardData.last10items.unshift(itemProp);
    $scope.managedItems[itemProp.id] = true;

  };

  $scope.getDashboardTotals = function(callback){
    dataService.get("/system-events", callback);
  };

  $scope.getAllSysLogs = function(callback){
    dataService.get("/system-log/*", {options:{sort:{"_meta.modified":1}, limit:10}}, callback);
  };

  $scope.updateDashboard = function(callback){

    $scope.resetDashboardData();

    $scope.getDashboardTotals(function(e, item){

      if (e) return callback(e);

      if (!item) return callback();

      $scope.dashboardData.restarts = item.restarts;
      $scope.dashboardData.uptime = item.uptime;
      $scope.dashboardData.load = item.load?item.load:0;
      $scope.dashboardData.errors = item.errors?item.errors:0;

      $scope.getAllSysLogs(function(e, items){

        if (e) return callback(e);

        items.map(function(item){
          $scope.insertLastItem(item);
        });
        tryApply();
        callback();
      });
    });
  };

  var eventsConnected = false;

  var init = function(){

    if (!eventsConnected){
      dataService.on('/*', function(item, _meta){
        item._meta = _meta;
        $scope.insertLastItem(item);
        tryApply();
      }, function(e){
        if (e) return $rootScope.notify('unable to attach dashboard to events!', 'danger');
      });
      eventsConnected = true;
    }

    $scope.updateDashboard(function(e){
      if (e) return $rootScope.notify('failed to fetch project data!', 'danger');
    });
  };

  dataService.onEvent('connect-successful', function(){
    init();
  });

  dataService.onEvent('reconnect-successful', function(){
    init();
  });

  if (dataService.connected) init();

  $scope.itemClicked = function (itemType, itemId, itemName) {

    if (itemId){

      var view = '../angular/templates/' + itemType + '-edit.html?' + itemType + 'Id=' + itemId;
      $scope.page.view = view;
      $scope.page.header = itemType + ' ' + itemName;

    }else{
      $scope.page.view = '../angular/templates/' + itemType + '-list.html';

      if (itemType == 'policy') itemType = 'policie';

      $scope.page.header = 'list ' + itemType + 's';
    }
    $scope.$apply();
  };

  $scope.openDocument = function(document, openType){
    var pathSegments = document._meta.path.split('/');
    var documentId = pathSegments[pathSegments.length - 1];
    $scope.page.view = '../angular/templates/document' + '-' + openType + '.html?documentId=' + documentId;
    $scope.page.header = 'document ' + ' ' + document.name;
    $scope.$apply();
  }


}]);

happnerControllers.controller('DashboardChartController', ['$scope', 'dataService', '$rootScope', function ($scope, dataService, $rootScope) {

  $scope.line = {
    labels: ["jan", "feb", "mar", "apr", "may", "jun", "jul"],
    series: ['conversations', 'templates'],
    data: [
      [12, 11, 14, 12, 10, 12, 13],
      [5, 3, 6, 9, 6, 3, 4]
    ],
    options: {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    }
  };

  $scope.bar = {
    labels: ["policy 1", "policy 2", "policy 3", "policy 4", "policy 5", "policy 6", "policy 7"],
    series: ['conversations', 'templates', 'rating'],
    data: [
      [12, 11, 14, 12, 10, 12, 13],
      [5, 3, 6, 9, 6, 3, 4],
      [2, 5, 8, 9, 9, 6, 5]
    ],
    options: []
  }

  $scope.doughnut = {
    labels: ["contract 1", "contract 2", "contract 3"],
    series: ['Series A', 'Series B'],
    data: [300, 500, 100],
    options: {}
  }

}]);

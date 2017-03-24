
happnerControllers.controller('NodesController', ['$scope', 'dataService', '$rootScope', function ($scope, dataService, $rootScope) {

  var tryApply = function(){
    try{
      $scope.$apply();
    }catch(e){

    }
  };

  $scope.nodes = {};


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

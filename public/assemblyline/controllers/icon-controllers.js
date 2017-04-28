happnerApp.controller('icon_select', ['$scope', '$uibModalInstance', 'data', 'args', 'dataService', function($scope, $uibModalInstance, data, args, dataService) {

  $scope.icon = 'glyphicons glyphicons-cube-empty';

  $scope.selectIcon = function($event){
    $uibModalInstance.close($event.currentTarget.className);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]);

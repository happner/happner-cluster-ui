happnerApp.controller('step_edit', ['$scope', '$uibModalInstance', 'data', 'args', 'dataService', '$rootScope', function($scope, $uibModalInstance, data, args, dataService, $rootScope) {

	console.log('step edit:::', args);
	$scope.step = {type: 'Step'};

	function validate(){
	  	return true;
	}

	$scope.ok = function () {

		if (validate())
		{
			$uibModalInstance.close({settings:$scope.step, id:args.id});
		}

	};

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	};

	dataService.instance.client.get(args.dataPath, function(e, data){

		if (data.type == 'Droid'){
			dataService.instance.client.get(data.control, function(e, control){
				var html = base64.decode(control.currentCode);
				$scope.html = html;
				$scope.$apply();
			});
		}

		if (data.type == 'Flow'){
			$uibModalInstance.dismiss('cancel');
			$rootScope.$broadcast('editItemSelected', data);
		}

	});

}]);

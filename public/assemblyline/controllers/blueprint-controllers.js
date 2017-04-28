

happnerApp.controller('blueprint_new', ['$scope', '$uibModalInstance', 'dataService', function($scope, $uibModalInstance, dataService) {

	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.blueprint = {name:'', description:'', type:'Blueprint'};

	  $scope.ok = function () {

	  	dataService.instance.client.get('/BLUEPRINTS/Blueprint/*', {criteria:{name:$scope.blueprint.name}}, function(e, blueprints){

	  		console.log(e, blueprints);

	  		if (e) return $scope.notify('error validating save: ' + e.toString(), 'danger', 0, true);

	  		if (blueprints.length > 0) return $scope.notify('A blueprint by this name already exists', 'warning', 0, true);

	  		dataService.instance.client.setSibling('/BLUEPRINTS/Blueprint', $scope.blueprint, function(e, newBlueprint){

	  			if (e) return $scope.notify('error saving blueprint: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newBlueprint);

	  		});

	  	});

	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };

}]);

happnerApp.controller('blueprint_edit', ['$scope', 'dataService', function($scope, dataService) {

	var onSave = function(args){
		 $scope.editData.meta = $scope.blueprint;
	};

	var onDelete = function(args){
		 console.log('onDelete clicked ');
		 console.log($scope.editData);
	};

	var actions = [
	{
		text:'save',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-floppy-disk'
	},
	{
		text:'delete',
		handler:onDelete,
 		cssClass:'glyphicon glyphicon-remove'
	}];

 	$scope.actions = actions;
 	$scope.$emit('editor_loaded', actions);


}]);

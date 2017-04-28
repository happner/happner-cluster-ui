happnerApp.controller('project_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.project = {name:'', description:'', type:'Project'};

	  $scope.utils = utils;

	  $scope.ok = function () {

	  	dataService.instance.client.get('/PROJECTS/Project/*', {criteria:{name:$scope.project.name}}, function(e, projects){

	  		console.log(e, projects);

	  		if (e) return $scope.notify('error validating save: ' + e.toString(), 'danger', 0, true);

	  		if (projects.length > 0) return $scope.notify('A project by this name already exists', 'warning', 0, true);

	  		dataService.instance.client.setSibling('/PROJECTS/Project', $scope.project, function(e, newProject){

	  			if (e) return $scope.notify('error saving project: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newProject);

	  		});

	  	});

	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };

}]);

happnerApp.controller('project_edit', ['$scope', 'dataService', function($scope, dataService) {

	var onSave = function(args){
		 $scope.editData.meta = $scope.project;
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

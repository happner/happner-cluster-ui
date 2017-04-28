happnerApp.controller('droid_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	$scope.utils = utils;

  	$scope.droid = {name:'', description:'', project:'', src:'', type: 'Droid'};

  	$scope.controls = [];
  	$scope.directives = [];

	$scope.projectSelected = function(){
		dataService.instance.client.get($scope.droid.project + '/*', function(e, projectItems){

			if (e) return $scope.notify('failure fetching project items', 'danger', 0, true);

			$scope.controls = [];
  			$scope.directives = [];

  			console.log('proj items:::', projectItems);

			projectItems.map(function(item){
				if (item.type == 'Control'){
					$scope.controls.push(item);
				}
				if (item.type == 'Directive'){
					$scope.directives.push(item);
				}
			});

			utils.sortByProperty('name',$scope.controls);
			utils.sortByProperty('name',$scope.directives);

			$scope.$apply();
		});
	}

	$scope.ok = function () {

	  	if (!$scope.droid.name) return $scope.notify('your droid needs a name', 'warning', 0, true);
		if (!$scope.droid.project) return $scope.notify('your droid needs a project', 'warning', 0, true);
		if (!$scope.droid.control) return $scope.notify('your droid needs controls', 'warning', 0, true);

		dataService.instance.client.get($scope.droid.project + '/Droid/*', {criteria:{name:$scope.droid.name}}, function(e, droids){

			if (droids.length > 0) return $scope.notify('a droid with this name already exists', 'warning', 0, true);

			dataService.instance.client.setSibling($scope.droid.project + '/Droid', $scope.droid, function(e, newDroid){

	  			if (e) return $scope.notify('error saving droid: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newDroid);

	  		});

		});

	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };

}]);

happnerApp.controller('droid_edit', ['$scope', 'dataService', 'utils', 'AppSession', function($scope, dataService, utils, AppSession) {

	$scope.utils = utils;

	$scope.controls = [];
  	$scope.directives = [];

	$scope.projectSelected = function(){
		dataService.instance.client.get($scope.droid.project + '/*', function(e, projectItems){

			if (e) return $scope.notify('failure fetching project items', 'danger', 0, true);

			$scope.controls = [];
  			$scope.directives = [];

			projectItems.map(function(item){
				if (item.type == 'Control'){
					$scope.controls.push(item);
				}
				if (item.type == 'Directive'){
					$scope.directives.push(item);
				}
			});

			utils.sortByProperty('name',$scope.controls);
			utils.sortByProperty('name',$scope.directives);

			$scope.$apply();
		});
	};

	$scope.selectIcon = function(){

		var handler = {
			saved:function(result){
				$scope.droid.icon = result;
			},
			dismissed:function(){}
		};

		return $scope.openModal('../templates/icon_select.html', 'icon_select', handler, [$scope.droid]);
	};

	var onSave = function(args){
		if (!$scope.droid.name) return $scope.notify('your droid needs a name', 'warning', 0, true);
		if (!$scope.droid.project) return $scope.notify('your droid needs a project', 'warning', 0, true);
		if (!$scope.droid.control) return $scope.notify('your droid needs controls', 'warning', 0, true);

		 dataService.instance.client.set($scope.droid._meta.path, $scope.droid, {merge:true}, function(e, response){
		 	if (e) $scope.notify('saving droid failed', 'danger');
		 });
	};

	var onDelete = function(args){

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

	$scope.projectSelected();

	$scope.actions = actions;
	$scope.$emit('editor_loaded', actions);

	dataService.instance.client.off($scope.droid._meta.path, function(e){
		if (e) return $scope.notify('unable to unattach to system events', 'danger');

		dataService.instance.client.on($scope.droid._meta.path, function(data, _meta){

		 	$scope.notify('droid updated', 'info');

		 }, function(e){

		 	if (e) return $scope.notify('unable to attach to system events', 'danger');

		 });
	});

}]);

happnerApp.controller('control_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	$scope.control = {
		name:'',
		description:'',
		project:'',
		type:'Control'
	};

	$scope.utils = utils;

	$scope.ok = function(){

		if (!$scope.control.name) return $scope.notify('your control needs a name', 'warning', 0, true);
		if (!$scope.control.project) return $scope.notify('your control needs a project', 'warning', 0, true);

		dataService.instance.client.get($scope.control.project + '/Control/*', {criteria:{name:$scope.control.name}}, function(e, controls){

			if (controls.length > 0) return $scope.notify('a control with this name already exists', 'warning', 0, true);

			dataService.instance.client.setSibling($scope.control.project + '/Control', $scope.control, function(e, newControl){

	  			if (e) return $scope.notify('error saving control: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newControl);

	  		});

		});

	}

}]);

happnerApp.controller('control_edit', ['$scope', 'dataService', 'AppSession', '$rootScope', 'hotkeys',
	function($scope, dataService, AppSession, $rootScope, hotkeys) {

	if ($scope.control.currentCode == null)
		$scope.control.currentCode = AppSession.defaultControlCode;

	$scope.editorCode = base64.decode($scope.control.currentCode);

	function save(){
		$scope.control.currentCode = base64.encode($scope.editorCode);
		dataService.instance.client.set($scope.control._meta.path, $scope.control, {merge:true}, function(e, response){
		 	if (e) $scope.notify('saving control failed', 'danger');
		});
	}

	function preview(){
		 $scope.openModal('../templates/control_view.html', 'control_view', null, {view_html:$scope.to_trusted($scope.editorCode)});
	}

	hotkeys.bindTo($scope)
    .add({
      combo: '⌘+s',
      description: 'save',
      callback: function() {
      	save();
      }
    })
    .add({
      combo: 'ctrl+s',
      description: 'save',
      callback: function() {
      	save();
      }
    })
    .add({
      combo: 'ctrl+v',
      description: 'preview',
      callback: function() {
      	preview();
      }
    })

 	var onSave = function(args){
 		save();
	};

	var onPreview = function(args){
		preview();
	};

	var actions = [
    {
    	text:'preview',
    	handler:onPreview,
    	cssClass:'glyphicon glyphicon-eye-open'
    },
	{
		text:'undo',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-arrow-left'
	},
	{
		text:'redo',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-arrow-right'
	},
	{
		text:'save',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-floppy-disk'
	},
	{
		text:'tag',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-tag'
	},
	{
		text:'history',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-time'
	},
	{
		text:'delete',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-remove'
	}];

	$scope.actions = actions;
	$scope.$emit('editor_loaded', actions);

	$scope.aceLoaded = function(){

	};

	$scope.aceChanged = function(){

	};

	dataService.instance.client.off($scope.control._meta.path, function(e){
		if (e) return $scope.notify('unable to unattach to system events', 'danger');

		dataService.instance.client.on($scope.control._meta.path, function(data, _meta){

		 	$scope.notify('control updated', 'info');
		 	$scope.editorCode = base64.decode(data.currentCode);

		 }, function(e){

		 	if (e) return $scope.notify('unable to attach to system events', 'danger');

		 });
	});

}]);

happnerApp.controller('control_view', ['$scope', '$uibModalInstance','$rootScope', 'dataService', 'AppSession', 'args', function($scope, $uibModalInstance, $rootScope, dataService, AppSession, args) {

	$scope.view_html = args.view_html;
	$scope.params = {Param1:'Test',Param2:'Test'};

	$scope.ok = function(){
		if (args.okHandler != null)
			args.okHandler($uibModalInstance);
		else
		{
			$uibModalInstance.close('Control viewed OK');
			console.log($scope.params);
		}

	};

	$scope.cancel = function(){
		if (args.cancelHandler != null)
			args.cancelHandler($uibModalInstance);
		else
			$uibModalInstance.close('Control viewed OK');
	};

}]);


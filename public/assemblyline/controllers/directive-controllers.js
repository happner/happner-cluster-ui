happnerApp.controller('directive_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	var controllerSettings = {
		parentPropertyName:'project',
		parentType:'Project',
		directiveTypeName:'Directive'
	}

	$scope.directive = {name:'', description:'', src:''};
	$scope.directive.type = controllerSettings.directiveTypeName;
	$scope.directive[controllerSettings.parentPropertyName] = '';

	$scope.related = {blueprint:null, project:null, templates:[]};

	$scope.init = function(settings){
		controllerSettings = angular.extend(controllerSettings, settings);
		console.log('doing ng init:::', controllerSettings);
		$scope.directive.type = controllerSettings.directiveTypeName;
		$scope.directive[controllerSettings.parentPropertyName] = '';
	}

	$scope.projectChanged = function(){

		console.log('project changed:::');

		$scope.related.templates = [];

		dataService.instance.client.get($scope.directive.project, function(e, project){

			if (e) return $scope.notify('an error happened fetching the related project', 'danger', 0, true);
			$scope.related.project = project;

			dataService.instance.client.get(project.blueprint, function(e, blueprint){

				if (e) return $scope.notify('an error happened fetching the related blueprint', 'danger', 0, true);
				$scope.related.blueprint = blueprint;
				///BLUEPRINTS/Blueprint/bb82f41b3e8c4f868f7eb561e635c871/Directive Template/99f8ff2c68c343e58308b2640a83d042
				var path = blueprint._meta.path + "/" + $scope.directive.type + " Template/*";
				console.log('getting path:::', path);
				dataService.instance.client.get(path, function(e, templates){

					if (e) return $scope.notify('an error happened fetching the related templates', 'danger', 0, true);
					$scope.related.templates = templates;
					console.log('project changed related:::', $scope.related);
					$scope.$apply();

				});

			});

		});
	}

	$scope.utils = utils;

	$scope.ok = function () {

		if (!$scope.directive.name) return $scope.notify('your directive needs a name', 'warning', 0, true);
		if (!$scope.directive[controllerSettings.parentPropertyName]) return $scope.notify('your directive needs a ' + controllerSettings.parentPropertyName, 'warning', 0, true);

		if(['Directive','Control'].indexOf($scope.directive.type) > -1){

			if (!$scope.directive.project) return $scope.notify('your directive needs a project', 'warning', 0, true);
			if (!$scope.directive.template) return $scope.notify('your directive needs a template', 'warning', 0, true);

			$scope.related.templates.map(function(templ){
				if (templ._meta.path == $scope.directive.template)
					$scope.directive.currentCode = templ.currentCode;
			});
		}

		dataService.instance.client.get($scope.directive[controllerSettings.parentPropertyName] + '/' + controllerSettings.directiveTypeName + '/*', {criteria:{name:$scope.directive.name}}, function(e, directives){

			if (directives.length > 0) return $scope.notify('an directive with this name already exists', 'warning', 0, true);

			dataService.instance.client.setSibling($scope.directive[controllerSettings.parentPropertyName] + '/' + controllerSettings.directiveTypeName, $scope.directive, function(e, newDirective){

	  			if (e) return $scope.notify('error saving directive: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newDirective);

	  		});

		});

		//$uibModalInstance.close($scope.directive);
	}

}]);

happnerApp.controller('directive_edit', ['$scope', 'dataService', 'AppSession', 'hotkeys', function($scope, dataService, AppSession, hotkeys) {

	console.log('scope gen:::', $scope.generator);

	var controllerSettings = {
		parentPropertyName:'project',
		parentType:'Project',
		directiveTypeName:'Directive',
		obj:'directive'
	}

	$scope.aceLoaded = function(){

	};

	$scope.aceChanged = function(){

	};

	$scope.propertiesVisible = false;

	$scope.editorSetup = {
	  useWrapMode : true,
	  showGutter: true,
	  theme:'eclipse',
	  mode: 'javascript',
	  onLoad: 'aceLoaded()',
	  onChange: 'aceChanged()'
	}

	var onToggleProperties = function (args) {
        $scope.propertiesVisible = !$scope.propertiesVisible;
        console.log('MADE VISIBLE:::', $scope.propertiesVisible);
        //$scope.$apply();
    };

	var initDirective = function(){
		if ($scope.directive.currentCode == null)
			$scope.directive.currentCode = AppSession.defaultDirectiveCode;

		$scope.editorCode = base64.decode($scope.directive.currentCode);

		console.log('$scope.directive._meta.path', $scope.directive._meta.path);

		dataService.instance.client.off($scope.directive._meta.path, function(e){
			if (e) return $scope.notify('unable to unattach to system events', 'danger');

			console.log('off was ok, now on:::');

			dataService.instance.client.on($scope.directive._meta.path, function(data, _meta){

			 	$scope.notify('directive updated', 'info', 5000);
			 	$scope.editorCode = base64.decode(data.currentCode);

			 }, function(e){

			 	if (e) return $scope.notify('unable to attach to system events', 'danger');

			 	console.log('on was ok:::');

			 });
		});
	}

	$scope.init = function(settings){
		controllerSettings = angular.extend(controllerSettings, settings);
		console.log('doing ng init:::', controllerSettings);

		$scope.directive = $scope[controllerSettings.obj];

		console.log('doing ng init again:::', controllerSettings);

		if (controllerSettings.mode != null && !$scope.directive.mode)
			$scope.directive.mode = controllerSettings.mode;

		if ($scope.directive.mode)
			$scope.editorSetup.mode = $scope.directive.mode;

		$scope.directive.type = controllerSettings.directiveTypeName;
		$scope.directive[controllerSettings.parentPropertyName] = '';

		initDirective();
	}

	$scope.updateMode = function(){
		console.log('updating mode');
		$scope.editorSetup.mode = $scope.directive.mode;
	}

	if ($scope.directive){
		initDirective();
	}

	var save = function(){
		 $scope.directive.currentCode = base64.encode($scope.editorCode);
		 dataService.instance.client.set($scope.directive._meta.path, $scope.directive, {merge:true}, function(e, response){
		 	if (e) $scope.notify('saving directive failed', 'danger');
		 });
	};

 	var onSave = function(args){
		save();
	};

	var actions = [
	{
        text: 'properties',
        handler: onToggleProperties,
        cssClass: 'glyphicon glyphicon-align-justify'
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

	hotkeys.bindTo($scope)
    .add({
      combo: 'ctrl+s',
      description: 'save',
      callback: function() {
      	save();
      }
    })
    .add({
      combo: 'command+s',
      description: 'save',
      callback: function(e) {

      	if (e && e.preventDefault){
      		console.log('prevented default:::');
      		e.preventDefault();
      	}
      	save();
      	return false;
      }
    })

}]);

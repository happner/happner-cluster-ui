
happnerApp.controller('DataEditController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4', '$routeParams',
  function ($scope, $rootScope, $compile, $q, dataService, tv4, $routeParams) {

    JSONEditor.defaults.editors.object.options.collapsed = false;
    JSONEditor.defaults.options.required_by_default = true;
    JSONEditor.defaults.options.theme = 'bootstrap3';

    $scope.changes = [];

    $scope.dataValue = {};
    $scope.basePath = '/system/data/' + $routeParams.type;

    $scope.changedData = null;
    $scope.dataSchema = {};

    $scope.currentType = $routeParams.type;
    $scope.currentId = $routeParams.id;

    $scope.getCommsPath = function(path){
      return '/comms/' + path.split('/').slice(-1)[0];
    };

    $scope.dataChangedSomewhereElseNoUpdate = function(data, meta){

      $scope.changes.push({message:'data was updated elsewhere'});
      $scope.$apply();

    };

    $scope.dataChangedSomewhereElse = function(data, meta){

      if (meta) data._meta = meta;

      if (!data.message) data.message = $scope.currentType + ' updated';

      $scope.changes.push(data);

      $scope.dataValue = data.data;

      console.log('changed somewhere else:::', data, meta);

      $scope.loadEditor();
    };

    $scope.openChangeUpdateChannel = function(path, callback){

      dataService.on(path, $scope.dataChangedSomewhereElseNoUpdate, function(e){

        if (e) return $rootScope.notify('unable to open control channel', 'danger', 2000);

        $scope.$apply();
        callback();

      });
    };

    $scope.openControlChannel = function(path, callback){

      var commsPath = $scope.getCommsPath(path);

      setTimeout(function(){//race condition, the data has not been changed yet
                            // we then do the .on after the change happens -
                            // must make sure that tiny window doesnt become an issue
                            // TODO: listen on comms channel always - just route comms by the id to the relevant view


        dataService.get(commsPath, function(e, lastChange){

          if (e) return $rootScope.notify('failed fetching last change', 'danger', 2000);

          if (lastChange)  $scope.dataChangedSomewhereElse(lastChange);

          dataService.on(commsPath, $scope.dataChangedSomewhereElse, function(e){

            if (e) return $rootScope.notify('unable to open control channel', 'danger', 2000);

            $scope.$apply();
            callback();

          });
        });

      }, 500);
    };

    $scope.init = function(){

      dataService.get('/system/data/schema/' + $scope.currentType, function(e, schema){

        if (e) return $rootScope.notify('failed to fetch schema', 'danger', 2000);

        $scope.dataSchema = schema;

        if ($scope.currentId != 'new'){

          dataService.get($scope.basePath + '/' + $scope.currentId, function(e, data){

            if (e) return $rootScope.notify('failed to fetch data', 'danger', 2000);

            $scope.dataValue = data;

            console.log('DATA VALUE:::', data);

            $scope.openChangeUpdateChannel($scope.basePath + '/' + $scope.currentId, function(e){

              if (e) return $rootScope.notify('failed to open control channel', 'danger', 2000);

            });

            $scope.openControlChannel($scope.basePath + '/' + $scope.currentId, function(e){

              if (e) return $rootScope.notify('failed to open control channel', 'danger', 2000);

              $scope.loadEditor();

            });
          });

        } else $scope.loadEditor();

      });
    };

    $scope.dataChanged = function(data){
      $scope.changedData = data;
    };

    $scope.saveData = function(){

      if (!$scope.changedData) return $rootScope.notify('you cannot save an unedited item', 'warning', 2000);

      console.log('doing save:::');

      if ($scope.currentId == 'new'){

        console.log('doing insert:::', $scope.changedData);

        dataService.setSibling($scope.basePath, $scope.changedData, function(e, item){

          if (e) return $rootScope.notify('failed to save item', 'danger', 2000);

          $scope.currentId = item._meta.path.split('/')[item._meta.path.split('/').length - 1];
          $scope.dataValue = item;

          $scope.openControlChannel(item._meta.path, function(e){

            return $rootScope.notify('item saved ok', 'success', 2000);

          });
        });

      } else {

        console.log('doing update:::', $scope.changedData);

        dataService.set($scope.basePath + '/' + $scope.currentId, $scope.changedData, {merge:true}, function(e){

          if (e) return $rootScope.notify('failed to update item', 'danger', 2000);

          return $rootScope.notify('item saved ok', 'success', 2000);

        });
      }
    };

    $scope.loadEditor = function () {

      var container = document.getElementById('editor-container');

      container.innerHTML = '';

      var editor = $scope.createEditorElement();

      var compiledElement = $compile(editor)($scope);

      angular.element(container).append(compiledElement);
    };

    $scope.createEditorElement = function () {
      return angular.element(document.createElement('json-editor'))
        .attr('schema', "dataSchema")
        .attr('startval', "dataValue")
        .attr('on-change', "dataChanged($editorValue)");
    };

    $scope.init();
  }
]);

happnerApp.controller('DataBlankController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4',
  function ($scope, $rootScope, $compile, $q, dataService, tv4) {

  }
]);


happnerApp.controller('DataSearchController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4', '$routeParams',
  function ($scope, $rootScope, $compile, $q, dataService, tv4, $routeParams) {

    $scope.changes = [];

    $scope.currentType = $routeParams.type;

    $scope.basePath = '/system/data/' + $scope.currentType;

    $scope.changedData = null;
    $scope.dataSchema = {};

    $scope.searchCriteria = '';

    $scope.data = {
      headers: [],
      rows: []
    };

    $scope.prepareUI = function(schema){
      schema.list_fields.forEach(function(field){
        $scope.data.headers.push(field);
      });
    };

    $scope.updateDataItem = function(item){

    };

    $scope.getValue = function(item, field, schema){

      var lastValue;
      var lastType;

      if (field.indexOf('.') > -1){

        var fields = field.split('.');

        lastValue = item;
        lastType = schema;

        fields.forEach(function(field){

          lastValue = lastValue[field];
          lastType = lastType.properties[field];

        });
      }

      else {
        lastValue = item[field];
        lastType = schema.properties[field];
      }

      if (lastValue == null) return "";

      return lastValue;

    };

    $scope.addDataItem = function(item){

      var newRow = {columns:[]};

      $scope.appSchema.list_fields.forEach(function(field){
        newRow.columns.push($scope.getValue(item, field, $scope.dataSchema));
      });

      newRow.id = item._meta.path.split('/')[item._meta.path.split('/').length - 1];
      newRow.editURI = '/data/' + $scope.dataSchema.title + '/edit/' + newRow.id;
      newRow.deleteURI = '/data/' + $scope.dataSchema.title + '/delete/' + newRow.id;

      $scope.data.rows.push(newRow);
    };

    $scope.dataChangedSomewhereElse = function(data, meta){

      if (meta) data._meta = meta;

      $scope.updateDataItem(data);

      $scope.$apply();
    };

    $scope.openControlChannel = function(path, callback){

      console.log('listing objects:::', path);

      dataService.get(path, function(e, initialValues){

        if (e) return $rootScope.notify('failed fetching last change', 'danger', 2000);

        console.log('object list:::', initialValues);

        if (initialValues.length > 0){
          initialValues.map(function(value){
            $scope.addDataItem(value);
          });
        }

        dataService.on(path, $scope.dataChangedSomewhereElse, function(e){

          if (e) return $rootScope.notify('unable to open control channel', 'danger', 2000);

          $scope.$apply();
          callback();

        });
      });
    };

    $scope.init = function(){

      dataService.get('/system/data/app_schema/' + $scope.currentType, function(e, appSchema){

        if (e) return $rootScope.notify('failed to fetch schema', 'danger', 2000);

        $scope.appSchema = appSchema;

        $scope.prepareUI($scope.appSchema);

        dataService.get('/system/data/schema/' + $scope.currentType, function(e, schema){

          if (e) return $rootScope.notify('failed to fetch schema', 'danger', 2000);

          $scope.dataSchema = schema;

          $scope.openControlChannel($scope.basePath + '/*', function(e){

            if (e) return $rootScope.notify('failed to open control channel', 'danger', 2000);

          });
        });
      });
    };

    $scope.init();
  }
]);

happnerApp.controller('DataFilterController', ['$scope', '$rootScope', '$compile', '$q', 'dataService', 'tv4',
  function ($scope, $rootScope, $compile, $q, dataService, tv4) {

  }
]);

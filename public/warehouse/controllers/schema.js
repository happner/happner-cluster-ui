
happnerApp.controller('SchemaEditController', ['$scope',
  '$rootScope',
  '$compile',
  '$q',
  'dataService',
  'tv4',
  '$routeParams',
  'AppSession',
  '$location',
  '$anchorScroll',
  function ($scope, $rootScope, $compile, $q, dataService, tv4, $routeParams, AppSession, $location, $anchorScroll) {

    $scope.currentSchemaId = $routeParams.type;

    $scope.baseSchema = {
      "id": "http://json-schema.org/draft-04/schema#",
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "Core schema meta-schema",
      "definitions": {
        "schemaArray": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#" }
        },
        "positiveInteger": {
          "type": "integer",
          "minimum": 0
        },
        "positiveIntegerDefault0": {
          "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
        },
        "simpleTypes": {
          "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        },
        "stringArray": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1,
          "uniqueItems": true
        }
      },
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uri"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "default": {},
        "multipleOf": {
          "type": "number",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "maximum": {
          "type": "number"
        },
        "exclusiveMaximum": {
          "type": "boolean",
          "default": false
        },
        "minimum": {
          "type": "number"
        },
        "exclusiveMinimum": {
          "type": "boolean",
          "default": false
        },
        "maxLength": { "$ref": "#/definitions/positiveInteger" },
        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "pattern": {
          "type": "string",
          "format": "regex"
        },
        "additionalItems": {
          "anyOf": [
            { "type": "boolean" },
            { "$ref": "#" }
          ],
          "default": {}
        },
        "items": {
          "anyOf": [
            { "$ref": "#" },
            { "$ref": "#/definitions/schemaArray" }
          ],
          "default": {}
        },
        "maxItems": { "$ref": "#/definitions/positiveInteger" },
        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "uniqueItems": {
          "type": "boolean",
          "default": false
        },
        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": {
          "anyOf": [
            { "type": "boolean" },
            { "$ref": "#" }
          ],
          "default": {}
        },
        "definitions": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "default": {}
        },
        "properties": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "default": {}
        },
        "patternProperties": {
          "type": "object",
          "additionalProperties": { "$ref": "#" },
          "default": {}
        },
        "dependencies": {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              { "$ref": "#" },
              { "$ref": "#/definitions/stringArray" }
            ]
          }
        },
        "enum": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true
        },
        "type": {
          "anyOf": [
            { "$ref": "#/definitions/simpleTypes" },
            {
              "type": "array",
              "items": { "$ref": "#/definitions/simpleTypes" },
              "minItems": 1,
              "uniqueItems": true
            }
          ]
        },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
      },
      "dependencies": {
        "exclusiveMaximum": [ "maximum" ],
        "exclusiveMinimum": [ "minimum" ]
      },
      "default": {}
    };

    $scope.unvalidatedSchema = null;

    $scope.currentSchema = {};
    $scope.currentStartVal = {};
    $scope.currentVersion = 0;

    $scope.previewOpen = false;

    $scope.currentStartVal = undefined;

    JSONEditor.defaults.editors.object.options.collapsed = false;
    JSONEditor.defaults.options.required_by_default = true;
    JSONEditor.defaults.options.theme = 'bootstrap3';

    $scope.validate = function(){

      try{

        $scope.unvalidatedSchema = JSON.parse($scope.SCHEMAEditor.getValue());
        var validationResult = tv4.validate($scope.unvalidatedSchema, $scope.baseSchema);
        if (!validationResult) return false;

        $scope.currentSchemaName = $scope.unvalidatedSchema.title?$scope.unvalidatedSchema.title:'no title';

        if ($scope.currentSchemaName == 'no title') return false;

        return true;

      }catch(e){
        return false;
      }
    };

    $scope.aceLoaded = function (_editor) {
      _editor.setReadOnly(false);
      $scope.SCHEMAEditor = _editor;
    };

    $scope.aceChanged = function () {

      if ($scope.SCHEMAEditor)  {
        try{

          if ($scope.validate()) {
            $scope.currentSchema = JSON.parse($scope.SCHEMAEditor.getValue());
            $rootScope.notify('schema is valid', 'success', 2000);
          }
          else return $rootScope.notify('schema is not valid', 'danger', 2000);

        }catch(e){
          $rootScope.notify('schema is not valid', 'danger', 2000);
        }
      }

    };

    $scope.previewSchema = function(){

      if($scope.jsoneditor) $scope.jsoneditor.destroy();

      $scope.jsoneditor = new JSONEditor(document.getElementById("editor_holder"),{
        schema: $scope.currentSchema,
        startVal:undefined
      });

      // Set the value
      $scope.jsoneditor.setValue({});

      $scope.previewOpen = true;

      $location.hash('preview_row');

      $rootScope.safeApply();

      $anchorScroll();
      // call $anchorScroll()
    };

    $scope.saveSchema = function () {

      if (!$scope.validate()) return;

      var path = "/data/schema/" + $scope.currentSchema.title;

      var handlerFunc = function (err, data) {

        if (err) return $rootScope.notify('failed to save schema!', 'danger');

        $scope.currentSchemaId = data._meta.path.split('/').slice(-1)[0];

        $rootScope.notify('schema saved (ID: ' + $scope.currentSchemaId + ')', 'success', 2000);
        $rootScope.safeApply();
      };

      dataService.get(path, function(e, previous){

        if (e) return $rootScope.notify('failed to save schema!', 'danger');

        if (previous != null){

          var confirmation = confirm('an existing schema by this name exists, you sure you want to overwrite it?');
          if (!confirmation) return;
        }

        $scope.currentVersion++;
        $scope.currentSchema['version'] = $scope.currentVersion;

        dataService.set(path, $scope.currentSchema, handlerFunc);
      });
    };

    $scope.onChange = function (data) {
      //$scope.schema = data;
      console.dir($scope.currentSchema);
    };

    $scope.updateSchemaJSON = function(){

    };

    loadData();

    function loadData() {

        return $q(function (resolve, reject) {

          var path = "/data/schema/" + $scope.currentSchemaId;

          // we only need to load a template if we are editing an existing one...
          if ($scope.currentSchemaId != 'new') {

            dataService.get(path, null, function (err, data) {

              if (err) reject(e);
              resolve(data);
            });

          } else resolve({
            "title": "[my new schema]",
            "type": "object",
            "properties": {
              "string property": {
                "type": "string",
                "description": "[description]",
                "minLength": 4,
                "default": "[default value]"
              },
              "integer property": {
                "type": "integer",
                "default": 25,
                "minimum": 18,
                "maximum": 99
              },
              "color property": {
                "type": "string",
                "format": "color",
                "title": "favorite color",
                "default": "#ffa500"
              },
              "enumeration property": {
                "type": "string",
                "enum": [
                  "male",
                  "female"
                ]
              },
              "composite_property": {
                "type": "object",
                "title": "another object",
                "properties": {
                  "nested_string": {
                    "type": "string",
                    "default": "generated"
                  },
                  "another_nested_string": {
                    "type": "string",
                    "default": "nicely!"
                  },
                  "generated_string": {
                    "type": "string",
                    "description": "generated automatically from previous 2 fields",
                    "template": "{{nested_string}} {{another_nested_string}}",
                    "watch": {
                      "nested_string": "composite_property.nested_string",
                      "another_nested_string": "composite_property.another_nested_string"
                    }
                  }
                }
              },
              "array_example": {
                "type": "array",
                "format": "table",
                "title": "array example",
                "uniqueItems": true,
                "items": {
                  "type": "object",
                  "title": "array item",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "cat",
                        "dog",
                        "bird",
                        "reptile",
                        "other"
                      ],
                      "default": "dog"
                    },
                    "name": {
                      "type": "string"
                    }
                  }
                },
                "default": [
                  {
                    "type": "dog",
                    "name": "Walter"
                  }
                ]
              }
            }
          });
        })
      .then(function (schema) {

        if ($scope.currentSchemaId != 'new') {

          $scope.currentVersion = schema.version;

          // remove fields
          delete schema._meta;
          delete schema.version;
        }

        $scope.currentSchema = schema;
        $scope.currentStartVal = {};

        $scope.schemaJSON = JSON.stringify($scope.currentSchema, null, 2);
        $scope.currentSchemaName = schema.title;

        //unsubscribe then resubscribe from the event handlers:

        if (AppSession.eventListeners['DataSchemaEditController'] == null)
          AppSession.eventListeners['DataSchemaEditController'] = {};

        if (AppSession.eventListeners['DataSchemaEditController']['actionClicked'] != null)
          AppSession.eventListeners['DataSchemaEditController']['actionClicked']();

        if (AppSession.eventListeners['DataSchemaEditController']['actionsReady'] != null)
          AppSession.eventListeners['DataSchemaEditController']['actionsReady']();

        //$scope.previewSchema();

        AppSession.eventListeners['DataSchemaEditController']['actionClicked'] = $rootScope.$on('actionClicked', function(event, action){

          if (action.editController != 'Edit') return;

          if (action.label == 'save'){
            $scope.saveSchema();
          }

          if (action.label == 'preview'){
            $scope.previewSchema();
          }

          if (action.label == 'search'){
            $location.path('/warehouse/schema/search');
          }

          if (action.label == 'delete'){

          }

          $rootScope.safeApply();
        });

        $rootScope.actionsController = 'DataSchemaEditController';

        AppSession.eventListeners['DataSchemaEditController']['actionsReady'] = $rootScope.$on('actionsReady', function(event, editController){

          if (editController == 'Edit'){

            $rootScope.registerActions([
              {label:'search', icon:'search'},
              {label:'preview', icon:'eye'},
              {label:'save', icon:'save'},
              {label:'delete', icon:'remove'}
            ]);

            $rootScope.safeApply();
          }
        });
      }, function (err) {

        return $rootScope.notify('unable to build schema editor', 'danger');

      });
    }
  }
]);

happnerApp.controller('SchemaSearchController', [
  '$scope',
  '$rootScope',
  '$window',
  '$q',
  'dataService',
  'AppSession',
  '$location',
  function ($scope,
            $rootScope,
            $window,
            $q,
            dataService,
            AppSession,
            $location) {

    $scope.searchCriteria = '';

    $scope.data = {
      headers: [
        "number",
        "name",
        "version"
      ],
      rows: []
    };

    function init() {
      // preload the list
      $scope.loadData();
    }

    $scope.filterFunction = function (element) {

      if (element.columns[1] == null || element.columns[1] == undefined) element.columns[1] = '';
      return element.columns[1].match('(' + $scope.searchCriteria + ')+') ? true : false;
    };

    $scope.loadData = function () {

      //clear the array
      $scope.data.rows = [];

      var criteria = {};

      dataService.get("/data/schema/*", {criteria: criteria}, function (e, schemas) {

        if (e) return $rootScope.notify('failed to fetch schemas', 'danger');

        schemas.map(function (schema) {

          dataRow = {
            columns: [
              schema.number,
              schema.name,
              schema.version
            ]
          };

          dataRow.editURI = '/warehouse/schema/edit/' + schema.number;
          dataRow.deleteURI = '/warehouse/schema/delete/' + schema.number;

          $scope.data.rows.push(dataRow);
        });

        //unsubscribe then resubscribe from the event handlers:

        if (AppSession.eventListeners['DataSchemaSearchController'] == null)
          AppSession.eventListeners['DataSchemaSearchController'] = {};

        if (AppSession.eventListeners['DataSchemaSearchController']['actionClicked'] != null)
          AppSession.eventListeners['DataSchemaSearchController']['actionClicked']();

        if (AppSession.eventListeners['DataSchemaSearchController']['actionsReady'] != null)
          AppSession.eventListeners['DataSchemaSearchController']['actionsReady']();

        //$scope.previewSchema();

        AppSession.eventListeners['DataSchemaSearchController']['actionClicked'] = $rootScope.$on('actionClicked', function(event, action){

          if (action.editController != 'Search') return;

          if (action.label == 'refresh'){
            $scope.loadData();
          }

          if (action.label == 'new'){
            $location.path('/warehouse/schema/edit/new');
            $rootScope.safeApply();
          }
        });

        $rootScope.actionsController = 'DataSchemaSearchController';

        AppSession.eventListeners['DataSchemaSearchController']['actionsReady'] = $rootScope.$on('actionsReady', function(event, editController){

          if (editController == 'Search'){
            $rootScope.registerActions([
              {label:'refresh', icon:'search'},
              {label:'new', icon:'plus'}
            ]);

            $rootScope.safeApply();
          }
        });

        $rootScope.safeApply();
      });
    };

    $scope.editSelected = function (row) {

      var id = row.columns[0];

      $scope.page.view = "../warehouse/templates/schema-edit.html?schemaId=" + id;
      $scope.page.header = 'edit schema';
    };

    $scope.deleteSelected = function (row) {

      var schemaId = row.columns[0];
      var path = '/data/schema/' + schemaId;

      dataService.remove(path, null, function (err) {
        if (err) return $rootScope.notify('schema (ID: ' + path + ') could not be deleted', 'danger', 2000);
        //reload
        $scope.loadData();
        return $rootScope.notify('schema (ID: ' + schemaId + ') deleted', 'success', 2000);
      });
    };

    $scope.exportSelected = function (row) {

      var schemaId = row.columns[0];
      var result = null;

      (function () {
        return $q(function (resolve, reject) {
          dataService.get('/data/schema/' + schemaId, function (err, schema) {

            if (!schema) reject('No schema found');

            resolve(schema);

          })
        })
      })()
        .then(function (schema) {
          // clone the schema
          result = JSON.parse(JSON.stringify(schema));

          delete result._meta;
          delete result.version;

          var data = JSON.stringify(result, null, 2);

          var blob = new Blob([data], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

          a.download = schemaId + '.json';
          a.href = $window.URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');

          e.initEvent('click', true, false);
          a.dispatchEvent(e);

        }, function (err) {
          return $rootScope.notify('failed to fetch schema', 'danger');
        });
    };

    init();
  }]);

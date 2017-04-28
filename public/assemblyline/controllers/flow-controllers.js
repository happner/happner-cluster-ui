happnerApp.controller('flow_new', ['$scope', '$uibModalInstance', 'dataService', 'utils',
  function ($scope, $uibModalInstance, dataService, utils) {

    $scope.utils = utils;

    $scope.flow = {
      name: '',
      description: '',
      project: '',
      type: 'Flow'
    };

    $scope.ok = function () {

      if (!$scope.flow.name) return $scope.notify('your assembly line needs a name', 'warning', 0, true);
      if (!$scope.flow.project) return $scope.notify('your assembly line needs a project', 'warning', 0, true);

      dataService.instance.client.get($scope.flow.project + '/Flow/*', {criteria: {name: $scope.flow.name}}, function (e, flows) {

        if (flows.length > 0) return $scope.notify('an assembly line with this name already exists', 'warning', 0, true);

        dataService.instance.client.setSibling($scope.flow.project + '/Flow', $scope.flow, function (e, newFlow) {

          if (e) return $scope.notify('error saving flow: ' + e.toString(), 'danger', 0, true);

          $uibModalInstance.close(newFlow);

        });

      });

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }
]);

happnerApp.controller('flow_edit', ['$scope', 'dataService', 'utils',
  function ($scope, dataService, utils) {

    $scope.drawingMethod = {};
    $scope.shapeCounters = {};

    if ($scope.flow.drawing) {
      $scope.flow.drawing.shapes.map(function (shape) {
        if (!$scope.shapeCounters[shape])
          $scope.shapeCounters[shape] = 1;

        $scope.shapeCounters[shape]++;
      });
    }

    if (!$scope.flow.floorPlanOpacity)
      $scope.flow.floorPlanOpacity = 10;

    $scope.floorPlan = {
      opacity: {
        from: 0,
        to: 10,
        floor: true,
        step: 1,
        vertical: false
      }
    }

    $scope.getShapeById = function (shapeId) {

      console.log('getting shape by id:::', shapeId);

      for (var shapeIndex in $scope.flow.drawing.shapes) {
        var shape = $scope.flow.drawing.shapes[shapeIndex];
        console.log('looking at shape by id:::', shape);
        if (shape.id == shapeId)
          return shape;
      }
      return null;
    }

    $scope.addShape = function (shape, x, y) {

      console.log('adding shape:::', shape);

      if (!$scope.shapeCounters[shape.name])
        $scope.shapeCounters[shape.name] = 1;
      else
        $scope.shapeCounters[shape.name]++;

      var shapeId = shape.name + '_' + $scope.shapeCounters[shape.name] + '_' + Date.now();

      if (!shape.cssClass) shape.cssClass = "";

      var shape = {
        dataPath: shape._meta.path,
        path: shape.path,
        id: shapeId.replace(/ /g, ''),
        label: shape.name + ' ' + $scope.shapeCounters[shape.name],
        icon: shape.icon,
        sourceEndPoints: [],
        targetEndPoints: [],
        dragdropEndPoints: ["LeftMiddle", "RightMiddle", "TopCenter", "BottomCenter"],
        cssClass: shape.cssClass,
        style: "",
        position: "top:" + y + "px;left:" + x + "px"
      }

      $scope.flow.drawing.shapes.push(shape);
      $scope.drawingMethod.newShape(shape);
    }


    $scope.onDrop = function ($event, $data) {

      console.log('drop attempt:::', $data.branch);

      if ($data.branch.type == 'Droid')
        $scope.addShape($data.branch, $event.layerX, $event.layerY);

      if ($data.branch.type == 'Flow') {
        $data.branch.cssClass = "info";

        if (!$data.branch.icon)
          $data.branch.icon = "glyphicons glyphicons-flowchart";

        $scope.addShape($data.branch, $event.layerX, $event.layerY);
        //addShape
      }

    };

    $scope.drawingEvent = function (event, params) {

      if (event == "connectionDragStop") {

        if (params[0].endpoints && params[0].endpoints.length == 2) {
          var endpoints = params[0].endpoints;
          var fromEndPoint = endpoints[0].anchor;
          var toEndPoint = endpoints[1].anchor;

          var connection = {
            uuids: [fromEndPoint.elementId.replace('flowchart', '') + fromEndPoint.type, toEndPoint.elementId.replace('flowchart', '') + toEndPoint.type],
            editable: true
          };
          console.log(connection);

          $scope.flow.drawing.connections.push(connection);
        }
      }

      if (event == "shape-clicked") {

        var handler = {
          saved: function (result) {
            console.log('step updated:::', result);
          },
          dismissed: function () {

          }
        };

        return $scope.openModal('../templates/step_edit.html', 'step_edit', handler, params);
      }

      if (event == "shape-removed") {

      }

      if (event == "shapeMoved") {
        var movedShape = params[0][0];
        var coordinates = params[1];
        var shape = $scope.getShapeById(movedShape.id.replace('flowchart', ''));
        shape.position = coordinates;
      }
    }

    $scope.shapeEdit = function (shape) {
      console.log('shape edit called');

    }

    if ($scope.flow.drawing == null) {

      $scope.flow.drawing = {
        id: 'sector_0_0',
        styles: {},
        shapeClass: 'shape',
        shapes: [],
        connections: [],
        config: {
          DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
          },
          ConnectionOverlays: [
            ["PlainArrow", {
              location: 1,
              width: 15,
              length: 15
            }]
          ]
        }
      }
    }

    $scope.getArray = function (items) {
      var returnArray = [];
      for (var itemName in items)
        returnArray.push(itemName);
      return returnArray;
    };

    $scope.projectSelected = function () {

      if ($scope.flow.project) {

      } else {

      }
    }

    var onSave = function (args) {
      dataService.instance.client.set($scope.flow._meta.path, angular.copy($scope.flow), {merge: true}, function (e, response) {
        console.log(e);
        if (e) $scope.notify('saving flow failed', 'danger');
      });
    };

    var onDelete = function (args) {

    };

    var onToggleProperties = function (args) {

      $scope.collapsed = !$scope.collapsed;

      $scope.$apply();
    };

    var viewMap = function () {

      var myEl = angular.element(document.querySelector('.flowchart-container'));
      myEl.removeClass('map');
      myEl.addClass('map');

      $scope.$apply();

    };

    var viewFlow = function () {

      var myEl = angular.element(document.querySelector('.flowchart-container'));
      myEl.removeClass('map');

      $scope.$apply();

    };

    var actions = [{
      text: 'map view',
      handler: viewMap,
      cssClass: 'glyphicons glyphicons-map-marker'
    }, {
      text: 'flow view',
      handler: viewFlow,
      cssClass: 'glyphicons glyphicons-flowchart'
    }, {
      text: 'properties',
      handler: onToggleProperties,
      cssClass: 'glyphicons glyphicons-menu-hamburger'
    }, {
      text: 'save',
      handler: onSave,
      cssClass: 'glyphicons glyphicons-floppy-disk'
    }, {
      text: 'delete',
      handler: onDelete,
      cssClass: 'glyphicons glyphicons-remove'
    }];

    $scope.actions = actions;
    $scope.$emit('editor_loaded', actions);

    dataService.instance.client.off($scope.flow._meta.path, function (e) {
      if (e) return $scope.notify('unable to unattach to system events', 'danger');

      dataService.instance.client.on($scope.flow._meta.path, function (data, _meta) {

        $scope.notify('flow updated', 'info', 5000);

      }, function (e) {

        if (e) return $scope.notify('unable to attach to system events', 'danger');

      });
    });

    $scope.selectIcon = function () {

      var handler = {
        saved: function (result) {
          $scope.flow.icon = result;
        },
        dismissed: function () {
        }
      };

      return $scope.openModal('../templates/icon_select.html', 'icon_select', handler, [$scope.flow]);
    };

  }
]);

'use strict';

/**
 * Binds an element to a jsplumb instance
 */
angular.module('ui.jsPlumb', [])
	.directive('jsPlumb', ['$templateCache', function ($templateCache) {
		if (angular.isUndefined(window.jsPlumb) || angular.isUndefined(window.jsPlumb)) {//TODO what is jquery.ui 's name?
			throw new Error('We need jsPlumb to work... (o rly?)');
		}

		/*
		 '<div ng-repeat="shape in drawingData.shapes" uib-tooltip="{{shape.label}}" tooltip-placement="bottom" class="{{drawingData.shapeClass + shape.cssClass}}" style="{{shape.style + shape.position}}" id="{{\'flowchart\' + shape.id}}"><br/><strong>{{ shape.label.length > 25?shape.label.substring(0,22) + "...", shape.label }}</strong><span class="action-container"><i class="action glyphicon glyphicon-remove"></i><i ng-click="drawingEvent(\'shape-clicked\', shape)" class="action glyphicon glyphicon-pencil"></i></span></div>' +
		 '</div> ',

		 '<div ng-repeat="shape in drawingData.shapes" class="{{drawingData.shapeClass + \' \' + (shape.cssClass?shape.cssClass:\'rect\')}}" uib-tooltip="{{shape.label}}" tooltip-placement="bottom" style="{{shape.style + shape.position}}" id="{{\'flowchart\' + shape.id}}"><br/><strong>{{ shape.label.length > 20?shape.label.substring(0,17) + "..." : shape.label }}</strong><span class="action-container"><i class="action glyphicon glyphicon-remove"></i><i ng-click="drawingEvent(\'shape-clicked\', shape)" class="action glyphicon glyphicon-pencil"></i></span></div>' +
		 '</div> ',
		 */

		return {
			restrict: 'E',
			scope: {
				drawingData: '=',
				drawingEvent: '=',
				drawingMethod:'=',
				redraw:'='
			},
			template: '<div class="flowchart" id="{{drawingData.id}}">' +
			'<div ng-repeat="shape in drawingData.shapes" ' +
			'class="{{drawingData.shapeClass + \' \' + (shape.cssClass?shape.cssClass:\'rect\')}}" ' +
			'uib-tooltip-template="\'/templates\/tooltip_shape.html\'" ' +
			'tooltip-popup-close-delay=2000 ' +
			'tooltip-popup-delay=1000 ' +
			'tooltip-placement="bottom" ' +
			'style="{{shape.style + shape.position}}" ' +
			'id="{{\'flowchart\' + shape.id}}">' +
			'<br id=\'shape_label\'/><strong id=\'shape_label\'>{{ shape.label.length > 20?shape.label.substring(0,17) + "..." : shape.label }}</strong><br id=\'shape_label\'/>' +
			'<span class="action-container">' +
			'<i class="action glyphicon glyphicon-remove"></i>' +
			'<i ng-click="drawingEvent(\'shape-clicked\', shape)" class="action glyphicon glyphicon-pencil"></i>' +
			'</span>' +
			'<span class="icon">' +
			'<i class="action glyphicons glyphicons-{{shape.icon?shape.icon:\'robot\'}}"></i>' +
			'</span>' +
			'<span class="shape-drag">' +
			'<i class="fa fa-arrows"></i>' +
			'</span>' +
			'</div>' +
			'</div> ',
			link: function (scope, elm, attrs) {
				var options, opts, instance;
				options = scope.drawingData.config || {
						// default drag options
						DragOptions : { cursor: 'pointer', zIndex:2000 },
						// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
						// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
						ConnectionOverlays : [
							[ "Arrow", { location:1,foldback:1 } ],
							[ "Label", {
								location:0.1,
								id:"label",
								cssClass:"aLabel"
							}]
						]
					};

				opts = angular.extend({}, options, scope.$eval(attrs.jsPlumb), {Container:scope.drawingData.id});
				instance = jsPlumb.getInstance(opts);

				instance.setContainer($("#" + scope.drawingData.id));

				// instance.__internalRepaint = instance.repaintEverything.bind(instance);
				// instance.repaintEverything = function(){
				//   console.log('repainting:::');
				//   this.__internalRepaint();
				// }

				scope.redraw = function(){
					instance.repaintEverything();
				}

				//
				// listen for clicks on connections, and offer to delete connections on click.
				//
				instance.bind("click", function(conn, originalEvent) {

					var sourceShapeId = conn.sourceId.replace('flowchart','');
					var targetShapeId = conn.targetId.replace('flowchart','');

					if (confirm("Delete connection from " + sourceShapeId + " to " + targetShapeId + "?"))
					{
						jsPlumb.detach(conn);
						scope.drawingEvent("connectionDetached", [conn, sourceShapeId, targetShapeId]);
					}

					scope.drawingEvent("click", [conn, originalEvent]);
				});

				instance.bind("connectionDrag", function(connection) {
					scope.drawingEvent("connectionDrag", [connection]);
				});

				instance.bind("connectionDragStop", function(connection) {
					scope.drawingEvent("connectionDragStop", [connection]);
				});

				instance.bind("connectionMoved", function(params) {
					scope.drawingEvent("connectionMoved", [params]);
				});

				scope.drawingEvent("instanceCreated", [instance]);

				scope.onDrop = function ($event, $data) {
					console.log('on droppded:::');
				};

				// this is the paint style for the connecting lines..
				var connectorPaintStyle = scope.drawingData.connectorPaintStyle || {
							lineWidth:2,
							strokeStyle:"#5E5E5E",
							joinstyle:"round",
							outlineColor:"white",
							outlineWidth:2
						},
				// .. and this is the hover style.
					connectorHoverStyle = scope.drawingData.connectorHoverStyle || {
							lineWidth:2,
							strokeStyle:"#216477",
							outlineWidth:2,
							outlineColor:"white"
						},
					endpointHoverStyle = scope.drawingData.endpointHoverStyle || {
							fillStyle:"#216477",
							strokeStyle:"#216477"
						},
					dragdropEndpoint = scope.drawingData.dragdropEndpoint || {
							endpoint:"Dot",
							paintStyle:{
								strokeStyle:"#5E5E5E",
								fillStyle:"transparent",
								radius:5,
								lineWidth:2
							},
							isSource:true,
							isTarget:true,
							maxConnections:-1,
							connector:[ "Flowchart", { stub:[20, 20], gap:5, cornerRadius:5, alwaysRespectStubs:true } ],
							connectorStyle:connectorPaintStyle,
							hoverPaintStyle:endpointHoverStyle,
							connectorHoverStyle:connectorHoverStyle,
							dragOptions:{},
							overlays:[]
						},
				// the definition of source endpoints (the small blue ones)
					sourceEndpoint = scope.drawingData.sourceEndpoint || {
							endpoint:"Dot",
							paintStyle:{
								strokeStyle:"#7AB02C",
								fillStyle:"transparent",
								radius:5,
								lineWidth:2
							},
							isSource:true,
							connector:[ "Flowchart", { stub:[20,20], gap:5, cornerRadius:5, alwaysRespectStubs:true } ],
							connectorStyle:connectorPaintStyle,
							hoverPaintStyle:endpointHoverStyle,
							connectorHoverStyle:connectorHoverStyle,
							dragOptions:{},
							overlays:[
								[ "Label", {
									location:[0.5, 1.5],
									label:"Drag",
									cssClass:"endpointSourceLabel"
								} ]
							]
						},
				// the definition of target endpoints (will appear when the user drags a connection)
					targetEndpoint = scope.drawingData.targetEndpoint || {
							endpoint:"Dot",
							paintStyle:{ fillStyle:"#7AB02C",radius:11 },
							hoverPaintStyle:endpointHoverStyle,
							maxConnections:-1,
							dropOptions:{ hoverClass:"hover", activeClass:"active" },
							isTarget:true,
							overlays:[
								[ "Label", { location:[0.5, -0.5], label:"Drop", cssClass:"endpointTargetLabel" } ]
							]
						},
				// initialize our connection - wire up edited event
					initConnection = function(connection) {
						connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
						connection.bind("editCompleted", function(o) {
							if (typeof console != "undefined")
								scope.drawingEvent("connectionEdited", [connection, o.path]);
						});
						scope.drawingEvent("connectionInitialized", [connection]);
					},

					initShape = function(shapeElement) {
						shapeElement.draggable(
							{
								containment:$('.flowchart-container'),
								grid:[10,10],
								stop: function( event, ui ) {

									var offset = $(this).offset();
									var xPos = offset.left;
									var yPos = offset.top;
									var position = 'top:' + ui.position.top + ';left:' + ui.position.left;

									scope.drawingEvent("shapeMoved", [$(this), position]);
								},
								drag: function(){
									instance.repaintEverything(); // (or) jsPlumb.repaintEverything(); to repaint the connections and endpoints
								}
							});
					};

				var _addEndpoints = function(toId, sourceAnchors, targetAnchors, dragdropAnchors) {

					//instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor:"Continuous", uuid:toId });
					if (sourceAnchors)
						for (var i = 0; i < sourceAnchors.length; i++) {
							var sourceUUID = toId + sourceAnchors[i];
							instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID });
						}
					if (targetAnchors)
						for (var j = 0; j < targetAnchors.length; j++) {
							var targetUUID = toId + targetAnchors[j];
							instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });
						}
					if (dragdropAnchors)
						for (var k = 0; k < dragdropAnchors.length; k++) {
							// try{
							var targetUUID = toId + dragdropAnchors[k];
							instance.addEndpoint("flowchart" + toId, dragdropEndpoint, { anchor:dragdropAnchors[k], uuid:targetUUID, source:"flowchart" + toId });
							// }catch(e){
							// 	console.log('addEndpoint failed:::', e);
							// }
						}

				};

				var addShape = function(shape){
					initShape($('#flowchart' + shape.id));
					_addEndpoints(shape.id, shape.sourceEndPoints, shape.targetEndPoints, shape.dragdropEndPoints);
				}

				if (scope.drawingMethod){
					scope.drawingMethod.newShape = function(shape){
						scope.newShape = shape;
					}
				}

				scope.drawingEvent("functionsPrepared", []);
				var loadedComplete = false;

				scope.$watch(
					//we are watching the container html
					function () { return document.getElementById(scope.drawingData.id).innerHTML},
					function(newval, oldval){

						var shapes = $(document.getElementById(scope.drawingData.id)).find('.' + scope.drawingData.shapeClass);

						//we check if the drawing hasn't been loaded yet, and we have the right amount of shapes in the html (ng-repeat is done)
						if (shapes != null && shapes.length == scope.drawingData.shapes.length && !loadedComplete)
						{
							// suspend drawing and initialise.
							instance.doWhileSuspended(function() {

								//connect all the shapes
								scope.drawingData.shapes.map(function(currentShape, arrInex, arr){
									addShape(currentShape);
								});

								// listen for new connections; initialise them the same way we initialise the connections at startup.
								instance.bind("connection", function(connInfo, originalEvent) {
									initConnection(connInfo.connection);
								});

								// link all connections to the current scopes shapes
								scope.drawingData.connections.map(function(currentConnection, arrIndex, arr){
									instance.connect(currentConnection);
								});

							});

							loadedComplete = true;
						}else{
							if (newval != oldval && scope.newShape){
								addShape(angular.copy(scope.newShape));
								delete scope.newShape;
							}

						}

					}, true);
			}
		};
	}]);
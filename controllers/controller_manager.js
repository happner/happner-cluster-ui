var fs = require('fs');
var path = require('path');
var async = require('async');
var constants = require('../constants');

function Controllers(){
  this.__controllers = {};
}

Controllers.prototype.each = function(iterator, callback, filter){

  var _this = this;

  var controllerKeys = Object.keys(_this.__controllers);

  if (filter) controllerKeys = filter;

  if (controllerKeys.length == 0) return callback();

  async.eachSeries(controllerKeys, function(controllerKey, controllerKeyCallback){

    var controller = _this.__controllers[controllerKey];

    iterator.call(iterator, controller, controllerKeyCallback);

  }, callback);

};

Controllers.prototype.objectId = function(type, callback){

  var _this = this;

  _this.__mesh.data.get('/_SYSTEM/warehouse/' + type + '/objectid', function(e, found){

    if (e) return callback(e);

    var id = 0;

    if (found != null) id = found.value;

    id += 1;

    _this.__mesh.data.set('/_SYSTEM/warehouse/' + type + '/objectid', id, {merge:true}, function(e){

      if (e) return callback(e);

      return callback(null, id);
    });
  });
};

Controllers.prototype.__log = function(type, message, data){

};

Controllers.prototype.__attachDataEventsAndMethodsToControllers = function(callback){
  var _this = this;

  _this.__mesh.data.on('/data/*', function(dataItem, _meta){

    var typeNameParts = _meta.path.replace('/data/', '').toLowerCase().replace(' ', '_');

    var typeName = typeNameParts.split('/')[0];

    if (_this.__controllers[typeName]){

      try{

        var controller = _this.__controllers[typeName];

        var action = _meta.action;

        if (action.indexOf('/SET') == 0 && _meta.created == _meta.modified) {
          dataItem._meta = _meta;
          controller.instance.onInsert(dataItem, _meta, _this.__getCommsPath(_meta.path));
        }

        if (action.indexOf('/SET') == 0 && _meta.created != _meta.modified) controller.instance.onUpdate(dataItem, _meta, _this.__getCommsPath(_meta.path));

        if (action.indexOf('/REMOVE') == 0) controller.instance.onDelete(dataItem, _meta, _this.__getCommsPath(_meta.path));

      } catch (e){

        if (e) return _this.__log('error', 'failed handling controller event', e);
      }
    }

  }, callback);
};

Controllers.prototype.__dataChanged = function(item, message, callback){

  var _this = this;

  var commsPath = _this.__getCommsPath(item._meta.path);

  _this.__mesh.data.set(commsPath, {data:item, message:message}, {merge:true}, function(e){

    if (e) return _this.__log('error', 'failed emitting comms event', e);

    if (callback) return callback(e);

  });
};

Controllers.prototype.__getCommsPath = function(path){

  return '/data/comms/' + path.split('/').slice(-1)[0];
};

Controllers.prototype.__initializeControllers = function(initOrder, callback){

  var _this = this;

  _this.each(function(controller, controllerCallback){

    Object.defineProperty(controller.instance, '__constants', {
      value:constants
    });

    Object.defineProperty(controller.instance, '__state', {
      value:constants.CONTROLLER_STATE.UNINITIALIZED
    });

    Object.defineProperty(controller.instance, '__mesh', {
      value:_this.__mesh
    });

    Object.defineProperty(controller.instance, '__manager', {
      value:_this
    });

    Object.defineProperty(controller.instance, '__exchange', {
      value:_this.__exchange
    });

    Object.defineProperty(controller.instance, '__events', {
      value:_this.__events
    });

    Object.defineProperty(controller.instance, '__controllers', {
      value:_this.__controllers
    });

    if (controller.instance.typeName){
      Object.defineProperty(controller.instance, '__objectId', {
        value:function(cb){
          return _this.objectId(this.typeName, cb);
        }.bind({typeName:controller.instance.typeName})
      });
    }

    if (!controller.instance.initialize) {
      controller.instance.state = constants.CONTROLLER_STATE.STARTED;
      return controllerCallback();
    }

    controller.instance.state = constants.CONTROLLER_STATE.INITIALIZING;

    controller.instance.initialize(controller.config, function(e){

      if (e){
        controller.instance.state = constants.CONTROLLER_STATE.ERROR;
        return controllerCallback(e);
      }

      controller.instance.state = constants.CONTROLLER_STATE.STARTED;
      controllerCallback();
    });

  }, callback, initOrder);

};

Controllers.prototype.__loadControllersFromDirectory = function(config, callback){

  var _this = this;

  if (!config.controllersPath) config.controllersPath = __dirname;
  if (!config.controllers) config.controllers = {};

  //generate config from subdirectories
  var files = fs.readdirSync(config.controllersPath);

  files.map(function (filename) {

    var filePath = config.controllersPath + path.sep + filename;
    var file = fs.statSync(filePath);

    if (file.isDirectory()) {

      var controllerFilePath = filePath + path.sep + 'controller.js';
      var controllerFile = fs.statSync(controllerFilePath);

      if (controllerFile.isFile()) {

        var controllerName = path.basename(filename);
        var Controller = require(controllerFilePath);

        if (!config.controllers[controllerName])config.controllers[controllerName] = {};

        var controllerConfig = config.controllers[controllerName];

        _this.__controllers[controllerName] = {
          instance: new Controller(),
          name: controllerName,
          config: controllerConfig
        };
      }
    }
  });

  callback();
};

Controllers.prototype.initialize = function(mesh, config, callback){

  var _this = this;

  if (!mesh) return callback(new Error('mesh required for controllers to load'));

  _this.__mesh = mesh._mesh;

  _this.__exchange = mesh.exchange;

  _this.__events = mesh.events;

  if (typeof config == 'function'){
    callback = config;
    config = {};
  }

  _this.__loadControllersFromDirectory(config, function(e){

    if (e) return callback(e);

    _this.__initializeControllers(config.initOrder, function(e){

      if (e) return callback(e);

      _this.__attachDataEventsAndMethodsToControllers(function(e){

        if (e) return callback(e);

        _this.__initialized = true;

        callback();
      });
    });
  });

};

Controllers.prototype.stop = function(opts, callback){

  var _this = this;

  if (typeof opts == 'function'){
    callback = opts;
    opts = {};
  }

  if (this.__initialized){
    this.each(function(controller, controllerCallback){
      if (controller.instance.stop) controller.instance.stop(controllerCallback);
      else controllerCallback();
    }, callback);
  }
};

module.exports = Controllers;

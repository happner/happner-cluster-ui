var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');

function ViewController(){}

ViewController.prototype.typeName = 'View';

ViewController.prototype.__loadSystemViews = function(config, callback){

  var _this = this;

  _this.__systemViews = {};

  var primaryOrganisationId = _this.__controllers['organisation'].instance.primaryOrganisation.number;

  _this.__isInitialized(function(e, isInitialized){

    if (e) return callback(e);

    if (isInitialized) {

      _this.__mesh.data.get('/data/view/*' , function(e, views){

        if (e) return callback(e);

        views.forEach(function(view){
          _this.__systemViews[view.name] = view;
        });

        callback();
      });

    } else {

      if (!config.viewsPath) config.viewsPath = __dirname + path.sep + 'system' + path.sep;

      //generate config from subdirectories
      var files = fs.readdirSync(config.viewsPath);

      async.eachSeries(files, function(viewFile, viewCB){

        var viewName = path.basename(viewFile).replace('.json', '');

        var viewObject = require(config.viewsPath + path.sep + viewFile);

        if (viewObject.title) viewName = viewObject.title;

        viewObject.name = viewName;

        viewObject.version = 0;

        var viewSchema = _this.__controllers['schema'].instance.systemSchemaByName(viewName);

        var defaultFilter = _this.__controllers['filter'].instance.defaultFilter;

        viewObject.mode.list.filters = [defaultFilter.number];

        if (!viewSchema) return viewCB(new Error('a matching view schema for view ' + viewName + ', could not be found.'));

        viewObject.schema.number = viewSchema.number;

        _this.__objectId(function(e, id){

          if (e) return viewCB(e);

          viewObject.number = id;

          _this.__mesh.data.set('/data/view/' + viewObject.number, viewObject, function(e, added){

            if (e) return viewCB(e);

            _this.__systemViews[viewName] = added;

            viewCB();
          });
        });

      }, function(e){

        if (e) return callback(e);

        _this.__setInitializedFlag(callback);

      });
    }
  });
};

ViewController.prototype.initialize = function(config, callback){

  this.__loadSystemViews(config, callback);
};

ViewController.prototype.onInsert = promise.promisify(function(view, callback){
  fs.writeFile(__dirname + path.sep + view.title + '.json', JSON.stringify(view), callback);
});

ViewController.prototype.onUpdate = promise.promisify(function(view, callback){
  fs.writeFile(__dirname + path.sep + view.title + '.json', JSON.stringify(view), callback);
});

ViewController.prototype.onDelete = promise.promisify(function(view, callback){
  callback();
});

module.exports = ViewController;

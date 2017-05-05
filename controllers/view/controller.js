var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');

function ViewController(){}

ViewController.prototype.typeName = 'View';

ViewController.prototype.__loadSystemViews = function(config, callback){

  var _this = this;

  if (!config.viewsPath) config.viewsPath = __dirname + path.sep + 'views' + path.sep + 'system';

  //generate config from subdirectories
  var files = fs.readdirSync(config.viewsPath);

  async.eachSeries(files, function(viewFile, viewCB){

    var viewName = path.basename(viewFile).replace('.json', '');

    var viewObject = require(config.viewsPath + path.sep + viewFile);

    viewObject.name = viewName;
    viewObject.version = 0;

    _this.__objectId(function(e, id) {

      if (e) return viewCB(e);

      viewName.number = id;

      _this.__mesh.data.set('/data/view/' + id, viewObject, function (e) {
        viewCB(e);
      });
    });

  }, callback);

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

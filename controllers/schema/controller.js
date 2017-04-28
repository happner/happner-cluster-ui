var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');

function SchemaController(){}

SchemaController.prototype.__loadSystemSchemas = function(config, callback){

  var _this = this;

  if (!config.schemasPath) config.schemasPath = __dirname + path.sep + 'schemas' + path.sep + 'system';

  //generate config from subdirectories
  var files = fs.readdirSync(config.schemasPath);

  async.eachSeries(files, function(schemaFile, schemaCB){

    var schemaName = path.basename(schemaFile).replace('.json', '');
    var schemaObject = require(config.schemasPath + path.sep + schemaFile);

    if (schemaObject.title) schemaName = schemaObject.title;

    schemaObject.version = 0;

    _this.__mesh.data.set('/system/data/schema/' + schemaName, schemaObject, schemaCB);

  }, callback);

};

SchemaController.prototype.initialize = function(config, callback){

  this.__loadSystemSchemas(config, callback);
};

SchemaController.prototype.onInsert = promise.promisify(function(schema, callback){
  fs.writeFile(__dirname + path.sep + schema.title + '.json', JSON.stringify(schema), callback);
});

SchemaController.prototype.onUpdate = promise.promisify(function(schema, callback){
  fs.writeFile(__dirname + path.sep + schema.title + '.json', JSON.stringify(schema), callback);
});

SchemaController.prototype.onDelete = promise.promisify(function(schema, callback){
  callback();
});

module.exports = SchemaController;
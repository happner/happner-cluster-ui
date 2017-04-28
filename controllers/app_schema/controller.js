var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');

function AppSchemaController(){}

AppSchemaController.prototype.__loadSystemAppSchemas = function(config, callback){

  var _this = this;

  if (!config.schemasPath) config.schemasPath = __dirname + path.sep + 'schemas' + path.sep + 'system';

  //generate config from subdirectories
  var files = fs.readdirSync(config.schemasPath);

  async.eachSeries(files, function(schemaFile, schemaCB){

    var schemaName = path.basename(schemaFile).replace('.json', '');
    var schemaObject = require(config.schemasPath + path.sep + schemaFile);

    if (schemaObject.schema) schemaName = schemaObject.schema;

    schemaObject.version = 0;

    _this.__mesh.data.set('/system/data/app_schema/' + schemaName, schemaObject, function(e){
      schemaCB(e);
    });

  }, callback);

};

AppSchemaController.prototype.initialize = function(config, callback){

  this.__loadSystemAppSchemas(config, callback);
};

AppSchemaController.prototype.onInsert = promise.promisify(function(schema, callback){
  fs.writeFile(__dirname + path.sep + schema.title + '.json', JSON.stringify(schema), callback);
});

AppSchemaController.prototype.onUpdate = promise.promisify(function(schema, callback){
  fs.writeFile(__dirname + path.sep + schema.title + '.json', JSON.stringify(schema), callback);
});

AppSchemaController.prototype.onDelete = promise.promisify(function(schema, callback){
  callback();
});

module.exports = AppSchemaController;
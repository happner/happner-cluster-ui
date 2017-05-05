var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');

function SchemaController(){}

SchemaController.prototype.typeName = 'Schema';

SchemaController.prototype.__loadSystemSchemas = function(config, callback){

  var _this = this;

  _this.__systemSchemas = {};

  if (!config.schemasPath) config.schemasPath = __dirname + path.sep + 'schemas' + path.sep + 'system';

  //generate config from subdirectories
  var files = fs.readdirSync(config.schemasPath);

  async.eachSeries(files, function(schemaFile, schemaCB){

    var schemaName = path.basename(schemaFile).replace('.json', '');

    var schemaObject = require(config.schemasPath + path.sep + schemaFile);

    if (schemaObject.title) schemaName = schemaObject.title;

    schemaObject.name = schemaName;
    schemaObject.version = 0;

    _this.__objectId(function(e, id){

      if (e) return schemaCB(e);

      schemaObject.number = id;

      _this.__mesh.data.set('/data/schema/' + schemaObject.number, schemaObject, function(e, added){

        if (e) return schemaCB(e);

        _this.__systemSchemas[schemaName] = added;

        schemaCB();
      });
    });
  }, function(e){
    if (e) return callback(e);

  });
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

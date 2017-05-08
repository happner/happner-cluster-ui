var promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var async = require('async');
var traverse = require('traverse');

function SchemaController(){}

SchemaController.prototype.typeName = 'Schema';

SchemaController.prototype.systemSchemaByName = function(name){

  for (var schemaName in this.__systemSchemas){
    if (schemaName == name) return this.__systemSchemas[schemaName];
  }
  return null;
};

SchemaController.prototype.__assignRefs = function(obj){

  traverse(obj).forEach(function (value) {

    if (this.key == '$ref'){
      this.parent.update(require(value));
    }
  });
};

SchemaController.prototype.__loadSystemSchemas = function(config, callback){

  var _this = this;

  _this.__systemSchemas = {};

  _this.__isInitialized(function(e, isInitialized){

    if (e) return callback(e);

    if (isInitialized) {

      _this.__mesh.data.get('/data/schema/*' , function(e, schemas){

        if (e) return callback(e);

        schemas.forEach(function(schema){
          _this.__systemSchemas[schema.name] = schema;
        });

        callback();
      });

    } else {

      if (!config.schemasPath) config.schemasPath = __dirname + path.sep + 'schemas' + path.sep + 'system';

      //generate config from subdirectories
      var files = fs.readdirSync(config.schemasPath);

      async.eachSeries(files, function(schemaFile, schemaCB){

        var schemaName = path.basename(schemaFile).replace('.json', '');

        var schemaObject = require(config.schemasPath + path.sep + schemaFile);

        _this.__assignRefs(schemaObject);

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

        _this.__setInitializedFlag(callback);

      });
    }

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

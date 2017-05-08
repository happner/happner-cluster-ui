var promise = require('bluebird');

function FilterController(){};

FilterController.prototype.typeName = 'Filter';

FilterController.prototype.initialize = function(config, callback){

  var _this = this;

  var primaryOrganisationId = _this.__controllers['organisation'].instance.primaryOrganisation.number;

  _this.__mesh.data.get('/data/filter/' + primaryOrganisationId + '/*',  function(e, filters) {

    if (e) return callback(e);

    var found;

    filters.every(function(filter){
      if (filter.name == 'default'){
        found = filter;
        return false;
      }
      return true;
    });

    if (found) {
      _this.defaultFilter = found;
      return callback();
    }

    _this.__objectId(function(e, id){

      if (e) return callback(e);

      var defaultFilter = require('./system/default.json');

      defaultFilter.organisation = primaryOrganisationId;

      _this.__mesh.data.set('/data/filter/' + primaryOrganisationId + '/' + id, defaultFilter, function(e, added) {

        if (e) return callback(e);

        _this.defaultFilter = added;

        return callback();
      });
    });
  });
};

FilterController.prototype.onInsert = promise.promisify(function(filter, callback){

});

FilterController.prototype.onUpdate = promise.promisify(function(filter, callback){

});

FilterController.prototype.onDelete = promise.promisify(function(filter, callback){

});

module.exports = FilterController;

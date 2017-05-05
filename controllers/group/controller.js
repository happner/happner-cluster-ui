var promise = require('bluebird');

function GroupController(){}

GroupController.prototype.typeName = 'Group';

GroupController.prototype.initialize = function(config, callback){

  var _this = this;

  var primaryOrganisationId = _this.__controllers['organisation'].instance.primaryOrganisation.number;

  _this.__mesh.data.get('/data/group/' + primaryOrganisationId + '/*', function(e, groups) {

    if (e) return callback(e);

    var found;

    groups.every(function(group){
      if (group.name == '_ADMIN'){
        found = group;
        return false;
      }
      return true;
    });

    if (found) {
      _this.primaryGroup = found;
      return callback();
    }

    _this.__objectId(function(e, id){

      if (e) return callback(e);

      var adminGroup = {
        name:'_ADMIN',
        permissions:{'*': {actions: ['*']}},
        number:id
      };

      _this.__mesh.data.set('/data/group/' + primaryOrganisationId + '/' + id, adminGroup, function(e, added) {

        if (e) return callback(e);

        _this.primaryGroup = added;

        return callback();
      });
    });
  });
};

GroupController.prototype.onInsert = promise.promisify(function(group, callback){

});

GroupController.prototype.onUpdate = promise.promisify(function(group, callback){

});

GroupController.prototype.onDelete = promise.promisify(function(group, callback){

});

module.exports = GroupController;

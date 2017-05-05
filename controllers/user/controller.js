var promise = require('bluebird');

function UserController(){}

UserController.prototype.typeName = 'User';

UserController.prototype.initialize = function(config, callback){

  var _this = this;

  var primaryOrganisationId = _this.__controllers['organisation'].instance.primaryOrganisation.number;

  var primaryGroupId = _this.__controllers['group'].instance.primaryGroup.number;

  _this.__mesh.data.get('/data/user/' + primaryOrganisationId + '/*',  function(e, users) {

    if (e) return callback(e);

    var found;

    users.every(function(user){
      if (user.name == '_ADMIN'){
        found = user;
        return false;
      }
      return true;
    });

    if (found) {
      _this.primaryUser = found;
      return callback();
    }

    _this.__objectId(function(e, id){

      if (e) return callback(e);

      var adminUser = {
        name:'_ADMIN',
        groups:{},
        number:id,
        organisation:primaryOrganisationId
      };

      adminUser.groups[primaryGroupId] = {state:_this.__constants.GROUP_MEMBERSHIP_STATE.ACTIVE};

      _this.__mesh.data.set('/data/user/' + primaryOrganisationId + '/' + id, adminUser, function(e, added) {

        if (e) return callback(e);

        _this.primaryUser = added;

        return callback();
      });
    });
  });
};

UserController.prototype.onInsert = promise.promisify(function(user, callback){

});

UserController.prototype.onUpdate = promise.promisify(function(user, callback){

});

UserController.prototype.onDelete = promise.promisify(function(user, callback){

});

module.exports = UserController;

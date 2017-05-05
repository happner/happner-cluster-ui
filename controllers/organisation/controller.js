var promise = require('bluebird');

function OrganisationController(){}

OrganisationController.prototype.typeName = 'Organisation';

OrganisationController.prototype.initialize = function(config, callback){

  var _this = this;

  if (!config.masterOrganisationName) config.masterOrganisationName = 'Master';

  _this.__mesh.data.get('/data/organisation/*', {criteria:{name:config.masterOrganisationName}}, function(e, found) {

    if (e) return callback(e);

    var primary = found[0];

    if (!primary){//create the primary org

      if (!config.primaryOrganisation) config.primaryOrganisation = {};

      if (!config.primaryOrganisation.name) config.primaryOrganisation.name = 'Primary';

      config.primaryOrganisation.isPrimary = true;

      _this.__objectId(function(e, id){

        if (e) return callback(e);

        config.primaryOrganisation.number = id;

        _this.__mesh.data.set('/data/organisation/' + id, config.primaryOrganisation, function(e, created) {

          if (e) return callback(e);

          _this.primaryOrganisation = created;

          callback();
        });
      });
    } else {
      _this.primaryOrganisation = primary;
      callback();
    }
  });
};

module.exports = OrganisationController;

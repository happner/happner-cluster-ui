var promise = require('bluebird');

function GroupController(){}

GroupController.prototype.initialize = function(config, callback){
  callback();
};

GroupController.prototype.onInsert = promise.promisify(function(group, callback){

});

GroupController.prototype.onUpdate = promise.promisify(function(group, callback){

});

GroupController.prototype.onDelete = promise.promisify(function(group, callback){

});

module.exports = GroupController;
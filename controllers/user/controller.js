var promise = require('bluebird');

function UserController(){}

UserController.prototype.initialize = function(config, callback){
  callback();
};

UserController.prototype.onInsert = promise.promisify(function(user, callback){

});

UserController.prototype.onUpdate = promise.promisify(function(user, callback){

});

UserController.prototype.onDelete = promise.promisify(function(user, callback){

});

module.exports = UserController;
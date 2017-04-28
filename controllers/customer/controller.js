var promise = require('bluebird');

function CustomerController(){};

CustomerController.prototype.__getCustomerID = function(callback){

  var _this = this;

  _this.__mesh.data.get('/system/data/customerID', function(e, found){

    if (e) return callback(e);

    var id = 0;

    if (found != null) id = found.value;

    id += 1;

    _this.__mesh.data.set('/system/data/customerID', id, {merge:true}, function(e){

      if (e) return callback(e);

      return callback(null, id);

    });
  });
};

CustomerController.prototype.initialize = function(config, callback){
  callback();
};

CustomerController.prototype.onInsert = promise.promisify(function(customer, meta, commsPath){
  var _this = this;

  console.log('onInsert:::', customer);

  _this.__getCustomerID(function(e, id){

    if (e) return _this.log('error', e);

    customer.number = id;

    _this.__mesh.data.set(meta.path, customer, {merge:true, noPublish:true}, function(e, updated){

      if (e) return _this.log('error', e);

      _this.__mesh.data.set(commsPath, {data:updated, message:'updated id'}, function(e){
        console.log('updated customer:::', commsPath, e);
      });
    });
  });
});

CustomerController.prototype.onUpdate = promise.promisify(function(customer, meta, commsPath){

  console.log('onUpdate:::', customer, meta);


});

CustomerController.prototype.onDelete = promise.promisify(function(customer, meta, commsPath){

  console.log('onDelete:::', customer, meta);

});

module.exports = CustomerController;
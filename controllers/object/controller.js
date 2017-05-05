var promise = require('bluebird');

function ObjectController(){};

ObjectController.prototype.typeName = 'Object';

ObjectController.prototype.onInsert = promise.promisify(function(object, meta, commsPath){

  var _this = this;

  _this.__objectID(function(e, id){

    if (e) return _this.log('error', e);

    object.number = id;

    _this.__mesh.data.set(meta.path, object, {merge:true, noPublish:true}, function(e, updated){

      if (e) return _this.log('error', e);

      _this.__mesh.data.set(commsPath, {data:updated, message:'updated id'}, function(e){
        console.log('created object:::', commsPath, e);
      });
    });
  });
});

ObjectController.prototype.onUpdate = promise.promisify(function(object, meta, commsPath){

  var _this = this;

  _this.__mesh.data.set(meta.path, object, {merge:true, noPublish:true}, function(e, updated){

    if (e) return _this.log('error', e);

    _this.__mesh.data.set(commsPath, {data:updated, message:'updated id'}, function(e){
      console.log('updated object:::', commsPath, e);
    });
  });

});

ObjectController.prototype.onDelete = promise.promisify(function(object, meta, commsPath){

  var _this = this;

  object.status = _this.OBJECT_STATES.DELETED;

  _this.__mesh.data.set(meta.path, object, {merge:true, noPublish:true}, function(e, updated){

    if (e) return _this.log('error', e);

    _this.__mesh.data.set(commsPath, {data:updated, message:'updated id'}, function(e){
      console.log('updated object:::', commsPath, e);
    });
  });

});

module.exports = ObjectController;

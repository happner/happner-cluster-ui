module.exports = UI;

var serveStatic = require('serve-static')
  , path = require('path')
  , sep = path.sep
  ;

function UI() {
  this.interval = null;
}


UI.prototype.public = serveStatic(__dirname + sep + 'public');


UI.prototype.start = function ($happn, callback) {

  this.interval = setInterval(function () {

    this.__emitClusterInfo($happn);

  }.bind(this), 1000);

  callback();

};


UI.prototype.stop = function ($happn, callback) {

  clearInterval(this.interval);

  callback();

};


UI.prototype.__emitClusterInfo = function ($happn) {

  if (process.env.MOCK_CLUSTER) {
    return this.__mockEmitClusterInfo($happn);
  }

  //...

};


UI.prototype.__mockEmitClusterInfo = function ($happn) {

  $happn.emit('cluster/info', {

    peers: [
      {
        name: 'WORKER_04',
        version: 'worker-1.0.0',
        components: [
          {
            name: 'info',
            version: '1.0.0'
          },
          {
            name: 'worker',
            version: '1.0.0'
          }
        ]
      },
      {
        name: 'WORKER_05',
        version: 'worker-2.0.0',
        components: [
          {
            name: 'info',
            version: '1.0.0'
          },
          {
            name: 'worker',
            version: '1.0.0'
          }
        ]
      }
    ]

  });

};

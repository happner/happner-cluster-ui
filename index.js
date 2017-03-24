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


UI.prototype.job = function ($happn, callback) {

  if (process.env.MOCK_CLUSTER) {
    return callback(null, 'MESH_NAME:COMPONENT_NAME:VERSION');
  }

  // call remote component running at another peer in the cluster
  // (added as dependency in package.json)

  $happn.exchange['happner-cluster-worker'].job(callback);

};


UI.prototype.__emitClusterInfo = function ($happn) {

  if (process.env.MOCK_CLUSTER) {
    return this.__mockEmitClusterInfo($happn);
  }

  //...

};


UI.prototype.__mockEmitClusterInfo = function ($happn) {

  var randomItems = {};

  randomItems.serverInfo1 = {

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
  };

  randomItems.serverInfo2 = {

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
      }
    ]
  };

  randomItems.serverInfo3 = {

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
      },
      {
        name: 'WORKER_06',
        version: 'worker-3.0.0',
        components: [
          {
            name: 'info',
            version: '1.0.0'
          },
          {
            name: 'worker',
            version: '1.0.0'
          },
          {
            name: 'blah',
            version: '1.0.0'
          }
        ]
      }
    ]
  };

  var randomIndex = Math.floor(Math.random() * 3) + 1;

  $happn.emit('cluster/info', randomItems['serverInfo' + randomIndex.toString()]);

};

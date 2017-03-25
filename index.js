module.exports = UI;

var serveStatic = require('serve-static')
  , path = require('path')
  , sep = path.sep
  ;

function UI() {

  this.interval = null;
  this.peerRemoveHandler = null;
  this.peers = {};

}


UI.prototype.public = serveStatic(__dirname + sep + 'public');


UI.prototype.start = function ($happn, callback) {

  if (!$happn._mesh) {
    return callback(new Error($happn.name + ' requires accessLevel: mesh'));
  }

  this.interval = setInterval(function () {

    this.__emitClusterInfo($happn);

  }.bind(this), 1000);

  if (process.env.MOCK_CLUSTER) return callback();

  $happn.event['happner-cluster-info'].on('peer/info', this.__handlePeerInfo.bind(this));

  $happn._mesh.happn.server.services.orchestrator.on('peer/remove',
    this.peerRemoveHandler = this.__handlePeerRemove.bind(this)
  );

  callback();

};


UI.prototype.stop = function ($happn, callback) {

  clearInterval(this.interval);

  if (process.env.MOCK_CLUSTER) return callback();

  // $happn.event['happner-cluster-info'].offPath('peer/info');

  $happn._mesh.happn.server.services.orchestrator.removeListener('peer/remove', this.peerRemoveHandler);

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


UI.prototype.__handlePeerInfo = function (data, meta) {

  this.peers[data.name] = data;

};


UI.prototype.__handlePeerRemove = function (name, peer) {

  delete this.peers[name]

};


UI.prototype.__emitClusterInfo = function ($happn) {

  if (process.env.MOCK_CLUSTER) {
    return this.__mockEmitClusterInfo($happn);
  }

  var peersArray = Object.keys(this.peers)
    .sort()
    .map(function (name) {
      return this.peers[name];
    }.bind(this));

  $happn.emit('cluster/info', {peers: peersArray});

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

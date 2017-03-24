
happnerControllers.controller('PeersController', ['$scope', 'dataService', '$rootScope', function ($scope, dataService, $rootScope) {

  $scope.logs = [];

  $scope.logsDisplay = [];

  $scope.topology = {
    peers:[]
  };

  $scope.updateLog = function(message){

    $scope.logs.push({message:message, when:Date.now()});

    $scope.logsDisplay = $scope.logs.slice(0, $scope.logs.length).reverse().slice(0, 20);

    $scope.$apply();
  };

  $scope.updatePeers = function(latest){

    var dataChanged = false;

    latest.peers.forEach(function(peer, latestPeerIndex){

      var found = false;

      $scope.topology.peers.forEach(function(existingPeer, existingPeerIndex){

        var peerChanged = false;

        if (existingPeer.name == peer.name){

          peerChanged = JSON.stringify(angular.toJson(existingPeer)) != JSON.stringify(angular.toJson(peer));
          found = true;
        }

        if (peerChanged) {
          $scope.topology.peers[existingPeerIndex] = peer;
          dataChanged = true;
        }
      });

      if (!found) {
        $scope.topology.peers.push(peer);
        dataChanged = true;
      }
    });

    $scope.topology.peers.slice(0, $scope.topology.peers.length).reverse().forEach(function(existingPeer, existingPeerIndex){

      var found = false;

      latest.peers.forEach(function(latestPeer, latestPeerIndex){

        if (latestPeer.name == existingPeer.name) found = true;
      });

      if (!found) {
        $scope.topology.peers.splice(existingPeerIndex, 1);
        dataChanged = true;
      }
    });

    return dataChanged;

  };

  dataService.client.event['happner-cluster-ui'].on('cluster/info', function(data){


    if ($scope.updatePeers(data)) $scope.updateLog('topology updated');
  });

  setInterval(function(){

    dataService.client.exchange['happner-cluster-ui'].job(function(e, result){

      $scope.updateLog('job performed by: ' + result);
    });

  }, 1000);

}]);

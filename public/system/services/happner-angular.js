(function (window, angular) {
  'use strict';

  if (!Happner) throw 'Happn browser client library not referenced';

  angular.module('happner', [])

    .factory('dataService', ['$window', '$rootScope', function (wind, $rootScope) {

      return {
        client: null,
        connected: false,
        disconnect: function (done) {
          var _this = this;
          if (_this.connected) {
            _this.client.data.offAll(function (e) {
              if (e) return done(e);
              _this.client.disconnect(function (e) {
                if (e) return done(e);
                _this.client = null;
                _this.connected = false;
                $rootScope.session.status = 'disconnected';
                done();
              });
            });
          } else done();
        },
        connect: function (app, host, port, username, password, done, protocol) {
          var _this = this;

          if (_this.connected) return done(new Error('attempt to connect whilst connected already, please call disconnect(done) first'));

          if (!protocol) protocol = 'http';

          _this.client = new Happner.MeshClient({
            protocol:protocol,
            host:host,
            port: port,
            secure: true
          });

          var attachSession = function() {

            _this.app = app;
            _this.connection = {host: host, port: port, username: username};
            _this.connected = true;

            $rootScope.data.session.user = username;
            $rootScope.data.session.status = 'connected';

            _this.client.on('reconnect/scheduled', function () {
              _this.emitEvent('reconnect-scheduled');
              $rootScope.data.session.status = 'reconnecting';
              $rootScope.$apply();
            });

            _this.client.on('reconnect/successful', function () {
              _this.emitEvent('reconnect-successful');
              $rootScope.data.session.status = 'connected';
              _this.connected = true;
            });

            _this.emitEvent('connect-successful');

            done(null);

          };

          _this.client
            .login({username: username, password: password})
            .then(attachSession).catch(done);

        },
        emitEvent:function(eventName, data){
          if (this.__events[eventName]){
            this.__events[eventName].map(function(handler){
              handler.call(handler, data);
            });
          }
        },
        __events:{},
        onEvent:function(eventName, handler){
          if (!this.__events[eventName])
            this.__events[eventName] = [];

          this.__events[eventName].push(handler);
          return this.__events[eventName].length;
        },
        offEvent:function(eventName, eventId){
          this.__events[eventName].handlers.splice(eventId, 1);
        },
        traverse: function (data, path, callback) {
          try {
            var currentNode = data;
            var found = false;

            if (path[0] = '/') path = path.substring(1, path.length);

            path.split('/').map(function (current, index, arr) {
              currentNode = currentNode[current];
              if (index + 1 == arr.length && currentNode) {
                found = true;
                callback(null, currentNode);
              }
            });

            if (!found) callback(null, null);

          } catch (e) {
            callback(e);
          }

        },
        get: function (path, opts, callback) {

          if (typeof opts == 'function') {
            callback = opts;
            opts = null;
          }

          if (!this.connected) return callback(new Error('not connected'));

          console.log('getting now:::', path, opts, callback);
          return this.client.data.get(path, opts, callback);

        },
        remove: function (path, opts, callback, absolutePath) {

          if (typeof opts == 'function') {
            callback = opts;
            opts = null;
          }

          if (!this.connected) return callback(new Error('not connected'));

          return this.client.data.remove(path, opts, callback);

        },
        set: function (path, data, opts, callback, absolutePath) {

          if (typeof opts == 'function') {
            callback = opts;
            opts = null;
          }

          if (!this.connected) return callback(new Error('not connected'));

          return this.client.data.set(path, data, opts, callback);

        },
        setSibling: function (path, data, callback, absolutePath) {

          if (!this.connected) return callback(new Error('not connected'));

          return this.client.data.setSibling(path, data, callback);

        },
        on: function (path, opts, handler, callback, absolutePath) {

          if (typeof opts == 'function') {
            callback = handler;
            handler = opts;
            opts = null;
          }

          if (!this.connected) return callback(new Error('not connected'));

          return this.client.data.on(path, opts, handler, function(e){
            console.log('DID ON:::', path, opts);
            callback(e);
          });
        },
        off: function (path, opts, callback, absolutePath) {

          if (typeof opts == 'function') {
            callback = opts;
            opts = null;
          }

          if (!this.connected) return callback(new Error('not connected'));

          return this.client.data.off(path, data, opts, callback);

        }
      }
    }])

})(window, window.angular);
module.exports = SeeAbove;

function SeeAbove() {
}

SeeAbove.prototype.method1 = function (opts, callback) {

  if (opts.errorAs == 'callback') return callback(new Error('THIS IS JUST A TEST'));
  if (opts.errorAs == 'throw') throw new Error('THIS IS JUST A TEST');

  opts.number++;
  callback(null, opts);
};

SeeAbove.prototype.method2 = function (opts, callback) {

  if (opts.errorAs == 'callback') return callback(new Error('THIS IS JUST A TEST'));
  if (opts.errorAs == 'throw') throw new Error('THIS IS JUST A TEST');

  opts.number++;
  callback(null, opts);
};

SeeAbove.prototype.method3 = function ($happn, $origin, opts, callback) {

  if (opts.errorAs == 'callback') return callback(new Error('THIS IS JUST A TEST'));
  if (opts.errorAs == 'throw') throw new Error('THIS IS JUST A TEST');

  opts.number++;
  callback(null, opts);
};

SeeAbove.prototype.doEmit = function ($happn, $origin, opts, callback) {
  opts.number++;
  $happn.emit('test-event', opts);
  callback(null, opts);
};

if (global.TESTING) return; // When 'requiring' the module above,

describe('happn-angular', function () {

  var expect = require('chai').expect;
  var Happner = require('happner');

  var happnerInstance;

  var PORT = 55005;
  var HOST = "127.0.0.1";
  var USERNAME = "_ADMIN";
  var PASSWORD = "happn";

  require('./fixtures/angular_test_helper');
  require('../middleware/static/angular/services/happner-angular');

  before("create a happner instance", function (done) {

    global.TESTING = true; //.............

    Happner.create({
      datalayer:{
        adminPassword: PASSWORD,
        secure: true,
        port: PORT
      },
      modules: {
        'testComponent': {
          path: __filename   // .............
        }
      },
      components: {
        'testComponent': {}
      }
    }, function (e, instance) {
      if (e) return done(e);

      delete global.TESTING;

      happnerInstance = instance;
      done();
    });
  });

  beforeEach(ngModule('happner'));

  beforeEach(inject(function (_$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $rootScope.data = {
      session: {}
    };
  }));

  var $rootScope;

  it('should login ok', function (done) {

    inject(function (dataService) {
      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e) {

        expect(e).to.equal(null);
        done();
      });
    });
  });

  it('should set some direct data', function (done) {

    inject(function (dataService) {
      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e, client) {
        expect(e).to.equal(null);
        dataService.set('/test/data', {"test": "data"}, {}, function (e, response) {

          expect(e).to.equal(null);
          expect(response.test).to.equal("data");
          expect(response._meta.path).to.equal("/test/data");
          done();

        }, true);
      });
    });
  });

  it('should get some direct data', function (done) {

    inject(function (dataService) {
      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e, client) {
        expect(e).to.equal(null);
        dataService.get('/test/data', {}, function (e, response) {

          expect(e).to.equal(null);
          expect(response.test).to.equal("data");
          expect(response._meta.path).to.equal("/test/data");
          done();

        }, true);
      });
    });
  });

  it('should remove some direct data', function (done) {

    inject(function (dataService) {
      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e, client) {
        expect(e).to.equal(null);

        dataService.remove('/test/data', {}, function (e, response) {

          expect(e).to.equal(null);
          expect(response.removed).to.equal(1);

          dataService.get('/test/data', {}, function (e, response) {

            expect(e).to.equal(null);
            expect(response).to.equal(null);
            done();

          }, true);

        }, true);
      });
    });

  });

  it('should listen for some direct data changes', function (done) {

    inject(function (dataService) {
      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e, client) {
        expect(e).to.equal(null);

        dataService.on('/test/data/on', {action: '*'}, function (data, meta) {

          expect(meta.action).to.equal('/SET@/test/data/on');
          expect(data.test).to.equal('on');

          done();

        }, function (e) {

          expect(e).to.equal(null);

          dataService.set('/test/data/on', {"test": "on"}, {}, function (e, response) {

            expect(e).to.equal(null);

            expect(response.test).to.equal("on");
            expect(response._meta.path).to.equal("/test/data/on");

          }, true);

        }, true);
      });
    });
  });

  it('should run a mesh method', function (done) {

    inject(function (dataService) {

      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e) {

        expect(e).to.equal(null);

        dataService.client.exchange.testComponent.method1({number:1}, function(e, result){

          expect(e).to.equal(null);
          expect(result.number).to.equal(2);

          done();

        });

      });
    });
  });

  it('should receive a mesh event', function (done) {

    inject(function (dataService) {

      dataService.connect('hub', HOST, PORT, USERNAME, PASSWORD, function (e) {

        expect(e).to.equal(null);

        dataService.client.event.testComponent.on('test-event', function(data){

          expect(data.number).to.equal(2);
          done();
        });

        dataService.client.exchange.testComponent.doEmit({number:1});

      });

    });
  });

  after("stop the happn database", function (done) {
    if (happnerInstance)
      happnerInstance.stop(done);
  });

});
process.env.MOCK_CLUSTER = true;

var Happner = require('happner-2')
  , path = require('path')
  ;

function MockClusterInfo(){}

var clusterInfo = new MockClusterInfo();

var service;

var config = {
  happn:{
    secure:true,
    adminPassword:'happnerclusterdemo',
    middleware: {
      security: {
        exclusions: [
          "/",
          "/css/*",
          "/js/*",
          "/fonts/*",
          "/system/*",
          "/app.js",
          "/assemblyline/*",
          "/organisation/*",
          "/cluster/*",
          "/warehouse/*",
          "/system-components/*",
          "/system-resources/*",
          "/img/*",
          "/icons/*",
          "/favicon.ico"
        ]
      }
    }
  },
  web:{
    routes:{
      '/':'happner-cluster-ui/public'
    }
  },
  modules:{
    'happner-cluster-ui':{
      path:path.resolve(__dirname, '../')
    },
    'happner-cluster-info':{
      instance:clusterInfo
    }
  },
  components:{
    'happner-cluster-ui':{
      accessLevel:'mesh',
      startMethod: 'start',
      stopMethod: 'stop',
      web:{
        routes:{
          public:'public'
        }
      }
    },
    'happner-cluster-info':{
      accessLevel:'mesh'
    }
  }
};

Happner.create(config)

  .then(function(serviceInstance){
    service = serviceInstance;
    console.log('service started...');
  })
  .catch(function(e){
    console.log('failed to start service...', e.toString());
    process.exit(1);
  });

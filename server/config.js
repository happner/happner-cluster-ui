var path = require('path')

/***********************************************************
 default to the test .env file to load environment variables
 ***********************************************************/

if (!process.env.EDGE_NODE_ENV || process.env.EDGE_NODE_ENV == 'TEST') require('dotenv').config({path: './test/.env-test'});

function MockClusterInfo(){}

var clusterInfo = new MockClusterInfo();

module.exports = {
  name: 'happnerclusterdemo',
  happn: {
    port: parseInt(process.env.MASTER_PORT),
    persist: true,
    secure: true,
    adminPassword: process.env.ADMIN_PASSWORD,
    log_level: 'info|error|warning',
    filename: __dirname + '/db/happner-angular.nedb',
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

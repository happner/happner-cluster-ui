process.env.MOCK_CLUSTER = true;

var Happner = require('happner-2')
  , path = require('path')
  ;

var service;

// var config = {
//   happn:{
//     secure:true,
//     adminPassword:'happnerclusterdemo',
//     middleware: {
//       security: {
//         exclusions: [
//           "/",
//           "/css/*",
//           "/js/*",
//           "/fonts/*",
//           "/system/*",
//           "/app.js",
//           "/assemblyline/*",
//           "/organisation/*",
//           "/cluster/*",
//           "/warehouse/*",
//           "/system-components/*",
//           "/system-resources/*",
//           "/img/*",
//           "/icons/*",
//           "/favicon.ico"
//         ]
//       }
//     }
//   },
//   web:{
//     routes:{
//       '/':'happner-cluster-ui/public'
//     }
//   },
//   modules:{
//     'happner-cluster-ui':{
//       path:path.resolve(__dirname, '../')
//     },
//     'happner-cluster-info':{
//       instance:clusterInfo
//     }
//   },
//   components:{
//     'happner-cluster-ui':{
//       accessLevel:'mesh',
//       startMethod: 'start',
//       stopMethod: 'stop',
//       web:{
//         routes:{
//           public:'public'
//         }
//       }
//     },
//     'happner-cluster-info':{
//       accessLevel:'mesh'
//     }
//   }
// };

var ServiceManager = require('../services/service_manager');
var config = require('./config.js');
var app = new ServiceManager();
var __started = false;

var terminate = function (code) {

  console.log('::: Terminating service...');
  console.log('::: Running termination tasks, 1 minute deadline...');

  setTimeout(function () {
    console.warn('::: Tasks not finishing in time, forcing close!');
    process.exit(0);
  }, 60000);

  if (__started) {
    app.stop(function (e) {

      if (e) {
        console.log('::: Error stopping services: ' + e);
        process.exit(1);
      }
      process.exit(0);
    });

  } else process.exit(0);
};

app.start(config, function (e) {
  if (e) {
    terminate(1);
  } else {
    __started = true;
  }
});

process.on('SIGTERM', function (code) {
  return terminate(code);
});

process.on('SIGINT', function (code) {
  return terminate(code);
});

// Happner.create(config)
//
//   .then(function(serviceInstance){
//     service = serviceInstance;
//     console.log('service started...');
//   })
//   .catch(function(e){
//     console.log('failed to start service...', e.toString());
//     process.exit(1);
//   });

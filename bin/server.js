var Happner = require('happner-2')
  , path = require('path')
  ;

var service;

var config = {
  web:{
    routes:{
      '/':'happner-cluster-ui/public'
    }
  },
  modules:{
    'happner-cluster-ui':{
      path:path.resolve(__dirname, '../')
    }
  },
  components:{
    'happner-cluster-ui':{
      web:{
        routes:{
          public:'public'
        }
      }
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
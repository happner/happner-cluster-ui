'use strict';

var happnerControllers = angular.module('happnerControllers', []);

happnerControllers.controller('AppController', ['$scope', 'dataService', '$rootScope', '$location', '$uibModal', function ($scope, dataService, $rootScope, $location, $uibModal) {

  $scope.connection = {
    host: $location.host(),
    port: $location.port(),
    protocol: $location.protocol(),
    username: '_ADMIN',
    password: 'happnerclusterdemo',
    message: ''
  };

  if ($location.search().host) $scope.connection.host = $location.search().host;

  if ($location.search().port) $scope.connection.port = $location.search().port;

  if ($location.search().protocol) $scope.connection.port = $location.search().protocol;

  $rootScope.data = {
    application: {
      name: 'happner cluster'
    },
    cache: {},
    message: {
      message: '',
      display: 'none',
      type: 'alert-info'
    },
    messagemodular: {
      message: '',
      display: 'none',
      type: 'alert-info'
    },
    templatePath: '',
    session: {
      status: 'disconnected',
      user: ''
    }
  };

  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $rootScope.notify = function (message, type, hide, modular, noRefresh) {

    if (!type) type = 'info';
    if (!hide) hide = 0;

    var notifyType = 'message';
    if (modular) notifyType = 'messagemodular';

    $rootScope.data[notifyType].type = 'alert-' + type;
    $rootScope.data[notifyType].message = message;
    $rootScope.data[notifyType].display = 'inline-block';

    if (hide) setTimeout(function () {
      $rootScope.data[notifyType].display = 'none';
      $rootScope.safeApply();
    }, hide);
    else {
      $rootScope.safeApply();
    }
  };

  $rootScope.updateData = function (item) {
    console.log('updating data:::', item);
  }

  $rootScope.openModal = function (templatePath, controller, handler, args) {

    var modalInstance = $uibModal.open({
      templateUrl: templatePath,
      controller: controller,
      resolve: {
        data: function () {
          return $scope.data;
        },
        args: function () {
          return args;
        }
      }
    });

    if (handler)
      modalInstance.result.then(handler.saved, handler.dismissed);
  };

  $rootScope.openNewModal = function (type, controller) {

    var handler = {
      saved: function (result) {
        $rootScope.updateData(result);
      },
      dismissed: function () {
        $log.info('Modal dismissed at: ' + new Date());
      }
    };

    return $scope.openModal('/system/templates/' + type + '-new.html', controller, handler);
  };

  $rootScope.to_trusted = function (html_code) {
    return $sce.trustAsHtml(html_code);
  };

  $scope.loginClicked = function () {

    $rootScope.notify('logging in', 'info', false, false, true);

    dataService.connect('hub', $scope.connection.host, $scope.connection.port, $scope.connection.username, $scope.connection.password, function (e) {

      if (e) {
        $rootScope.notify('failed to login', 'danger', false, false, true);
        return;
      }

      $scope.loggedIn = true;

      try {
        $rootScope.safeApply();
      } catch (e) {

      }
      $rootScope.notify('logged in', 'success', 2000, false, false, true);

    });
  }

}]);

happnerControllers.controller('SessionController', ['$scope', 'dataService', '$rootScope', function ($scope, dataService, $rootScope) {


  $scope.page = {
    view: "/system/templates/dashboard.html",
    sidebar:"/system/templates/sidebar.html",
    header: "dashboard"
  };

  // $scope.page = {
  //   view: "",
  //   header: ""
  // };

  $scope.menuClicked = function (instruction) {

    // var instructionParts = instruction.split('|');
    //
    // var type = instructionParts[0];
    // var action = instructionParts[1];
    //
    // var id = 'new';
    //
    // if (instructionParts.length > 2) id = instructionParts[2];
    //
    // var view = type + '-' + action;
    //
    // //anything other than these special types can get processed using the generic data module
    // if (['data','schema','app-schema'].indexOf(type) == -1) view = 'data' + '-' + action;
    //
    // $scope.page.type = type;
    // $scope.page.id = id;
    //
    // $scope.page.view = "/angular/templates/blank.html";
    //
    // $rootScope.safeApply();
    //
    // $scope.page.view = "/angular/templates/" + view + ".html";
    // $scope.page.header = view.replace("-", " ");

    $rootScope.safeApply();

  };

  $scope.newItem = function (view) {

  }

}]);

happnerControllers.controller('BreadCrumbController', ['$scope', 'dataService', '$rootScope', '$location', '$uibModal', function ($scope, dataService, $rootScope, $location, $uibModal) {

  $scope.breadcrumbs = [];

  $rootScope.$on("$locationChangeStart", function(event, next, current) {

    $scope.breadcrumbs = [];

    try{

      var nextParts = next.replace('http://', '').replace('https://', '').split('/');

      $scope.breadcrumbs.push({label:nextParts[1].toLowerCase(), url:'/' + nextParts[1]}); //area

      $scope.breadcrumbs.push({label:nextParts[2].toLowerCase(), url:[nextParts[1], nextParts[2],'search'].join('/')}); //type

      if (nextParts[3] && nextParts[4]) $scope.breadcrumbs.push({label:nextParts[4].toLowerCase(), url:next}); //area

    }catch(e){
      //do nothing
    }

    $rootScope.safeApply();
  });
}]);

happnerControllers.controller('ActionsController', ['$scope', 'dataService', '$rootScope', '$location', '$uibModal', function ($scope, dataService, $rootScope, $location, $uibModal) {

  $scope.actions = [];

  $rootScope.registerActions = function(actions) {

    $scope.actions = [];

    actions.forEach(function(action){
      $scope.actions.push(action);
    });

    $rootScope.safeApply();

    $rootScope.$emit('registerActions', actions);
  };

  $rootScope.actionClicked = function(action){
    $rootScope.$emit('actionClicked', action);
  };

  $rootScope.$emit('actionsReady');

  console.log('SET UP ROOTSCOPE:::');

}]);

//ActionsController


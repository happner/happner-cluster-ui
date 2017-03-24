'use strict';

/* Services */

var happnerServices = angular.module('happnerServices', []);

happnerServices.service('utils', ['$rootScope', '$location', function ($rootScope, $location) {

  this.toPropertyNameArray = function (obj) {
    var returnArray = [];

    for (var prop in obj)
      returnArray.push(prop);
    return returnArray;
  };

  this.toArray = function (obj) {
    var returnArray = [];

    for (var prop in obj)
      returnArray.push(obj[prop]);

    return returnArray;
  };

  this.sortByProperty = function (propertyName, arr, direction) {
    if (!direction || ['ASC', 'DESC'].indexOf(direction) == -1)
      direction = 'ASC';

    arr.sort(function (a, b) {
      if (a[propertyName] != null && b[propertyName] != null) {
        if (direction == 'ASC')
          return a - b;
        else
          return b - a;
      }
    });

    return arr;
  }

  this.getViewParameter = function (viewUrl, name) {

    if (!viewUrl) viewUrl = location.href;
    var decodedViewUrl = decodeURI(viewUrl);

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var regexS = "[\\?&]" + name + "=([^&#]*)";

    var regex = new RegExp(regexS);

    var results = regex.exec(decodedViewUrl);

    return results == null ? null : results[1];
  }

  //NB: this must also change in ../utils
  this.wildcardMatch = function (pattern, matchTo) {

    var regex = new RegExp(pattern.replace(/[*]/g, '.*'));
    var matchResult = matchTo.match(regex);

    if (matchResult) return true;
    return false;
  };

  //taken from https://github.com/alessioalex/tiny-each-async
  this.async = function (arr, parallelLimit, iteratorFn, cb) {

    var pending = 0;
    var index = 0;
    var lastIndex = arr.length - 1;
    var called = false;
    var limit;
    var callback;
    var iterate;

    if (typeof parallelLimit === 'number') {
      limit = parallelLimit;
      iterate = iteratorFn;
      callback = cb || function noop() {
        };
    } else {
      iterate = parallelLimit;
      callback = iteratorFn || function noop() {
        };
      limit = arr.length;
    }

    if (!arr.length) {
      return callback();
    }

    var iteratorLength = iterate.length;

    var shouldCallNextIterator = function shouldCallNextIterator() {
      return (!called && (pending < limit) && (index < lastIndex));
    };

    var iteratorCallback = function iteratorCallback(err) {
      if (called) {
        return;
      }

      pending--;

      if (err || (index === lastIndex && !pending)) {
        called = true;

        callback(err);
      } else if (shouldCallNextIterator()) {
        processIterator(++index);
      }
    };

    var processIterator = function processIterator() {
      pending++;

      var args = (iteratorLength === 2) ? [arr[index], iteratorCallback]
        : [arr[index], index, iteratorCallback];

      iterate.apply(null, args);

      if (shouldCallNextIterator()) {
        processIterator(++index);
      }
    };

    processIterator();
  };

  this.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

}]);

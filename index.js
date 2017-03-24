var serveStatic = require('serve-static')
  , path = require('path')
  , sep = path.sep
  ;

function UI(){

}

UI.prototype.public = serveStatic(__dirname + sep + 'public');

module.exports = UI;
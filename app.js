var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , item   = require('./item')
  , realm   = require('./realm')
  , profession = require('./profession')
  , admin   = require('./admin')
  , mongoose = require('mongoose')
  , cluster  = require('cluster')
  , loggly   = require('loggly')
  , fs       = require('fs')
  , util     = require('util');

var app    = express();
var config = { subdomain: "pixelhaven" };
var logger = loggly.createClient(config);

app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/test');

app.db = mongoose.createConnection(app.get('mongodb-uri'));

app.db.once('open', function() {
  //console.log('Mongoose open for business');
});

require('./models')(app, mongoose);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
  app.use(logErrors);
});

function logErrors(err, req, res, next) {
    logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '[ERROR] ' + err);
    next(err);
}

app.configure('development', function(){

  console.log('[DEV]');

  jsfiles = [
    '/js/vendor/taffy.js',
    '/js/lib/bootstrap.min.js',
    '/js/lib/gritter.js',
    '/js/lib/tuj.js',
    '/js/lib/angular.js'
  ];

  var modules = path.join(__dirname, 'public/modules');

  var modulesDir = fs.readdirSync(modules);

  for(var module in modulesDir) {
    
    var contents = fs.readdirSync(modules + '/' + modulesDir[module]);    

    console.log('Module:   ', modulesDir[module]);
    console.log('Contains: ', contents);    

    for(var file in contents) {

      if(contents.hasOwnProperty(file)) {

        var f = fs.statSync(modules + '/' + modulesDir[module] + '/' + contents[file]);

        if(f.isFile()) {
          //console.log('\n' + modules + '/' + modulesDir[module] + '/' + contents[file] + ' is file.');
          jsfiles.push('/modules/' + modulesDir[module] + '/' + contents[file]);
        }

      }

    }

    console.log('\n--------------\n');

  }

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  console.log(jsfiles);

  app.locals.scripts = jsfiles;

});

app.configure('production', function(){

  console.log('[PROD]');
  
  app.use(express.errorHandler());

});

require('./routes')(app, realm, admin, profession, item);

//require('./queue')(app, logger);

module.exports = http.createServer(app);
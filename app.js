var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , item   = require('./item')
  , realm   = require('./realm')
  , profession = require('./profession')
  , admin   = require('./admin')
  , mongoose = require('mongoose')
  , cluster  = require('cluster')
  , loggly   = require('loggly');

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
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

require('./routes')(app, realm, admin, profession, item);

require('./queue')(app, logger);

/*

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

*/

module.exports = http.createServer(app);
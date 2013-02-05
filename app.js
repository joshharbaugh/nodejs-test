var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , realm   = require('./realm')
  , profession = require('./profession')
  , admin   = require('./admin');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// SETTING CONTENT-TYPE FOR ALL RESPONSES TO APPLICATION/JSON
// app.get('/*', function(req, res, next) { res.contentType('application/json'); next(); });
// app.post('/*', function(req, res, next) { res.contentType('application/json'); next(); });
// app.put('/*', function(req, res, next) { res.contentType('application/json'); next(); });
// app.delete('/*', function(req, res, next) { res.contentType('application/json'); next(); });

// FRONT-END ROUTES
app.get('/', realm.index);
app.get('/realm/:id', realm.read);
app.get('/realms', realm.list);

// BACK-END ROUTES
app.get('/admin', admin.index);
app.get('/admin/professions', profession.index);
app.get('/admin/profession', profession.show);
app.post('/admin/profession', profession.create);
app.get('/admin/profession/:id', profession.read);
app.post('/admin/profession/:id', profession.addItem);
app.put('/admin/profession/:id', profession.update);
app.delete('/admin/profession/:id', profession.delete);
app.delete('/admin/profession/:id/deleteItem', profession.deleteItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , realm   = require('./realm')
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

app.get('/', realm.index);
app.get('/realm/:id', realm.read);
app.get('/realms', realm.list);

app.get('/admin', admin.index);

// REALM

app.get('/admin/realm/:name', admin.list);

// ITEM

app.get('/admin/edit/:id', admin.read);
app.post('/admin/edit/:id', admin.update);
app.delete('/admin/edit/:id', admin.delete);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

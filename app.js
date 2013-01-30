var express = require('express')
  , http    = require('http')
  , request = require('request')
  , path    = require('path')
  , fs      = require('fs')
  , RealmProvider = require('./realmprovider-mongodb').RealmProvider;

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

var RealmProvider = new RealmProvider('localhost', 27017);

app.get('/', function(req, res){
  RealmProvider.findAll(function(err, docs){
    res.render('index.jade', { title: '', realms:docs });
  });
});

app.get('/realm/:id', function(req, res){
  RealmProvider.findById(req.params.id, function(error, realm) {
      res.render('realm_show.jade', { title: realm.name, realm:realm });
  });
});

app.get('/realms', function(req, res){
  request('http://us.battle.net/api/wow/realm/status', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var resp = JSON.parse(body);

      for (var key in resp.realms) {

        var realm = resp.realms[key];

        console.log(realm, typeof realm);

        //for (var prop in realm) {
        //  alert(prop + " = " + realm[prop]);
        //}

        RealmProvider.save(realm, function(err, doc) {

          console.log('Saved.');

        });

      }

      res.send("All done.");

      //res.render('index.jade', { title: '', realms: JSON.stringify(body) });
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

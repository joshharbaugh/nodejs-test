var express = require('express')
  , http    = require('http')
  , request = require('request')
  , path    = require('path')
  , fs      = require('fs')
  , armory  = require('armory').defaults({ region: 'us' })
  , RealmProvider   = require('./realmprovider-mongodb').RealmProvider
  , AuctionProvider = require('./auctionprovider-mongodb').AuctionProvider;

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

var RealmProvider   = new RealmProvider('localhost', 27017);
var AuctionProvider = new AuctionProvider('localhost', 27017);

app.get('/', function(req, res){
  RealmProvider.findAll(function(err, realms){
    res.render('index.jade', { title: '', realms:realms, collection:JSON.stringify(realms) });
  });
});

app.get('/realm/:id', function(req, res){
  RealmProvider.findById(req.params.id, function(error, realm) {

    console.log('\n------------------[' + realm.name + ']------------------\n');

    var file, lastModified, auctions;

    try {

      console.log('\n------------------[PULL LOCAL: FIRST TRY]------------------\n');

      AuctionProvider.findByName(realm.name, function(error, response) {
        if( error ) return;
        if( response ) {
        
          console.log("Response Type: ", typeof response);
          res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response) });
        
        } else {

          armory.auction(realm.name, function(err, urls) {
              
              file         = urls[0].url;
              lastModified = urls[0].lastModified;

              armory.auctionData({
                  //lastModified: lastModified,
                  name: realm.name              
              }, function(err, response) {          
                  if( err ) return;

                  console.log(typeof response);

                  if(typeof response == 'object' && response) {

                    console.log('\n------------------[PULL REMOTE]------------------\n');

                    var neutral  = response.neutral;
                    var alliance = response.alliance;
                    var horde    = response.horde;
                    var name     = response.realm.name;

                    console.log('\nAlliance = ' + alliance,
                                '\nHorde    = ' + horde + '\n\n');

                    AuctionProvider.save(response, function(err, doc) {

                      console.log('\n------------------[SAVE]------------------\n');
                      //console.log('\n' + response + '\n');
                      console.log('\n------------------[END]-------------------\n');

                    });

                    res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response) });
                  
                  } else {

                    console.log('\n------------------[PULL LOCAL: FINAL TRY]------------------\n');

                    AuctionProvider.findByName(realm.name, function(error, response) {
                      if( error ) return;
                      if( response ) {
                      
                        console.log("Response Type: ", typeof response);
                        res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response) });
                      
                      } else {

                        console.log("No response");
                        res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}) });

                      }

                    });

                  }

              });

          });

        }

      });

    } catch(e) {

      res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}) });
    
    }

  });
});

app.get('/realms', function(req, res){
  request('http://us.battle.net/api/wow/realm/status', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var resp = JSON.parse(body);

      for (var key in resp.realms) {

        var realm = resp.realms[key];

        RealmProvider.save(realm, function(err, doc) {

          console.log('\n------------------[SAVE]------------------\n');
          console.log('\n' + realm + '\n');
          console.log('\n------------------[END]-------------------\n');

        });

      }

      res.redirect('/');
    }
  });
});

app.get('/auctions/all', function(req, res) {
  RealmProvider.findAll(function(err, realms) {

    for (var key in realms) {

      var realm = realms[key];

      request('http://us.battle.net/api/wow/auction/data/' + realm.slug, function (error, response, body) {
        if(error) throw error;
        if (!error && response.statusCode == 200) {
        
          var resp        = JSON.parse(body);
          var currentTime = Math.round(new Date().getTime()/1000);
          var refresh     = false;

          for (var key in resp.files) {

            var files        = resp.files[key];
            var lastModified = (files.lastModified/1000);
            var timeDiff     = (currentTime-lastModified);

            console.log('\nurl          = ' + files.url,
                        '\nlastModified = ' + lastModified,
                        '\ncurrentTime  = ' + currentTime,
                        '\ntimeDiff     = ' + timeDiff);

            console.log('\n----------------------------------\n');

            if(timeDiff > 86400) {
              refresh = true;
            }

            request(files.url, function (e, r, b) {
              if ( e ) throw e;
              if( !e && r.statusCode == 200 ) {

                var resp = JSON.parse(b);

                for (var key in resp) {

                  var name     = resp.realm.name;
                  var alliance = resp.alliance;
                  var horde    = resp.horde;
                  var neutral  = resp.neutral;

                }

                console.log('\nname     = ' + name,
                            '\nalliance = ' + alliance,
                            '\nhorde    = ' + horde,
                            '\nneutral  = ' + neutral);

              }
            });

          }

        }

      });

    }

    console.log('Done');

    res.send('All done');
    
  });
})

app.get('/auctions/:id', function(req, res) {
  RealmProvider.findById(function(err, realms) {

    for (var key in realms) {

      var realm = realms[key];

      request('http://us.battle.net/api/wow/auction/data/' + realm.slug, function (error, response, body) {
        if(error) throw error;
        if (!error && response.statusCode == 200) {
        
          var resp        = JSON.parse(body);
          var currentTime = Math.round(new Date().getTime()/1000);
          var refresh     = false;

          for (var key in resp.files) {

            var files        = resp.files[key];
            var lastModified = (files.lastModified/1000);
            var timeDiff     = (currentTime-lastModified);

            console.log('\nurl          = ' + files.url,
                        '\nlastModified = ' + lastModified,
                        '\ncurrentTime  = ' + currentTime,
                        '\ntimeDiff     = ' + timeDiff);

            console.log('\n----------------------------------\n');

            if(timeDiff > 86400) {
              refresh = true;
            }

            request(files.url, function (e, r, b) {
              if ( e ) throw e;
              if( !e && r.statusCode == 200 ) {

                var resp = JSON.parse(b);

                for (var key in resp) {

                  var name     = resp.realm.name;
                  var alliance = resp.alliance;
                  var horde    = resp.horde;
                  var neutral  = resp.neutral;

                }

                console.log('\nname     = ' + name,
                            '\nalliance = ' + alliance,
                            '\nhorde    = ' + horde,
                            '\nneutral  = ' + neutral);

              }
            });

          }

        }

      });

    }

    console.log('Done');

    res.send('All done');
    
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

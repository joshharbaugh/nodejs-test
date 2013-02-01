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

var RealmProvider       = new RealmProvider('localhost', 27017);
var AuctionProvider     = new AuctionProvider('localhost', 27017);
var ProfessionsProvider =
{
  "alchemy": {
    "alliance": {
      "cost": "3000 gold",
      "items": [
        {
          "id": 765,
          "qty": 59,
          "name": "Silverleaf",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 785,
          "qty": 20,
          "name": "Mageroyal",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 2447,
          "qty": 59,
          "name": "Peacebloom",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 2450,
          "qty": 93,
          "name": "Briarthorn",
          "realmCost": 1500,
          "globalCost": 350
        }
      ]
    },
    "horde": {
      "cost": "2345 gold",
      "items": [
        {
          "id": 765,
          "qty": 59,
          "name": "Silverleaf",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 785,
          "qty": 20,
          "name": "Mageroyal",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 2447,
          "qty": 59,
          "name": "Peacebloom",
          "realmCost": 500,
          "globalCost": 100
        },
        {
          "id": 2450,
          "qty": 93,
          "name": "Briarthorn",
          "realmCost": 1500,
          "globalCost": 350
        }
      ]
    }
  }, 
  "cooking": {
    "alliance": {
      "cost": "123 gold",
      "items": [
        {
          "id": 30817,
          "qty": 60,
          "name": "Simple Flour",
          "realmCost": 500,
          "globalCost": 10478
        },
        {
          "id": 3173,
          "qty": 40,
          "name": "Bear Meat",
          "realmCost": 500,
          "globalCost": 3764
        },
        {
          "id": 3685,
          "qty": 50,
          "name": "Raptor Egg",
          "realmCost": 500,
          "globalCost": 750
        },
        {
          "id": 12207,
          "qty": 25,
          "name": "Giant Egg",
          "realmCost": 500,
          "globalCost": 8375
        },
        {
          "id": 20424,
          "qty": 15,
          "name": "Sandworm Meat",
          "realmCost": 500,
          "globalCost": 9375
        },
        {
          "id": 27682,
          "qty": 35,
          "name": "Talbuk Venison",
          "realmCost": 500,
          "globalCost": 3450
        },
        {
          "id": 43012,
          "qty": 35,
          "name": "Rhino Meat",
          "realmCost": 500,
          "globalCost": 12997
        },
        {
          "id": 2596,
          "qty": 30,
          "name": "Dwarven Stout",
          "realmCost": 500,
          "globalCost": 41000
        },
        {
          "id": 62778,
          "qty": 20,
          "name": "Toughened Flesh",
          "realmCost": 500,
          "globalCost": 17307
        },
        {
          "id": 53064,
          "qty": 25,
          "name": "Highland Guppy",
          "realmCost": 500,
          "globalCost": 74899
        },
        {
          "id": 2678,
          "qty": 60,
          "name": "Mild Spices",
          "realmCost": 500,
          "globalCost": 10100
        },
        {
          "id": 2675,
          "qty": 50,
          "name": "Crawler Claw",
          "realmCost": 500,
          "globalCost": 4599
        },
        {
          "id": 12184,
          "qty": 50,
          "name": "Raptor Flesh",
          "realmCost": 500,
          "globalCost": 3700
        },
        {
          "id": 35562,
          "qty": 40,
          "name": "Bear Flank",
          "realmCost": 500,
          "globalCost": 17053
        },
        {
          "id": 27674,
          "qty": 30,
          "name": "Ravager Flesh",
          "realmCost": 500,
          "globalCost": 4049
        },
        {
          "id": 43013,
          "qty": 50,
          "name": "Chilled Meat",
          "realmCost": 500,
          "globalCost": 2934
        },
        {
          "id": 43007,
          "qty": 15,
          "name": "Northern Spices",
          "realmCost": 500,
          "globalCost": 4151
        },
        {
          "id": 2595,
          "qty": 15,
          "name": "Jug of Bourbon",
          "realmCost": 500,
          "globalCost": 38415
        },
        {
          "id": 53067,
          "qty": 25,
          "name": "Striped Lurker",
          "realmCost": 500,
          "globalCost": 23200
        },
        {
          "id": 53072,
          "qty": 25,
          "name": "Deepsea Sagefish",
          "realmCost": 500,
          "globalCost": 43065
        }
      ]
    },
    "horde": {
      "cost": "345 gold",
      "items": [
        {
          "id": 30817,
          "qty": 60,
          "name": "Simple Flour",
          "realmCost": 500,
          "globalCost": 10478
        },
        {
          "id": 3173,
          "qty": 40,
          "name": "Bear Meat",
          "realmCost": 500,
          "globalCost": 3764
        },
        {
          "id": 3685,
          "qty": 50,
          "name": "Raptor Egg",
          "realmCost": 500,
          "globalCost": 750
        },
        {
          "id": 12207,
          "qty": 25,
          "name": "Giant Egg",
          "realmCost": 500,
          "globalCost": 8375
        },
        {
          "id": 20424,
          "qty": 15,
          "name": "Sandworm Meat",
          "realmCost": 500,
          "globalCost": 9375
        },
        {
          "id": 27682,
          "qty": 35,
          "name": "Talbuk Venison",
          "realmCost": 500,
          "globalCost": 3450
        },
        {
          "id": 43012,
          "qty": 35,
          "name": "Rhino Meat",
          "realmCost": 500,
          "globalCost": 12997
        },
        {
          "id": 2596,
          "qty": 30,
          "name": "Dwarven Stout",
          "realmCost": 500,
          "globalCost": 41000
        },
        {
          "id": 62778,
          "qty": 20,
          "name": "Toughened Flesh",
          "realmCost": 500,
          "globalCost": 17307
        },
        {
          "id": 53064,
          "qty": 25,
          "name": "Highland Guppy",
          "realmCost": 500,
          "globalCost": 74899
        },
        {
          "id": 2678,
          "qty": 60,
          "name": "Mild Spices",
          "realmCost": 500,
          "globalCost": 10100
        },
        {
          "id": 2675,
          "qty": 50,
          "name": "Crawler Claw",
          "realmCost": 500,
          "globalCost": 4599
        },
        {
          "id": 12184,
          "qty": 50,
          "name": "Raptor Flesh",
          "realmCost": 500,
          "globalCost": 3700
        },
        {
          "id": 35562,
          "qty": 40,
          "name": "Bear Flank",
          "realmCost": 500,
          "globalCost": 17053
        },
        {
          "id": 27674,
          "qty": 30,
          "name": "Ravager Flesh",
          "realmCost": 500,
          "globalCost": 4049
        },
        {
          "id": 43013,
          "qty": 50,
          "name": "Chilled Meat",
          "realmCost": 500,
          "globalCost": 2934
        },
        {
          "id": 43007,
          "qty": 15,
          "name": "Northern Spices",
          "realmCost": 500,
          "globalCost": 4151
        },
        {
          "id": 2595,
          "qty": 15,
          "name": "Jug of Bourbon",
          "realmCost": 500,
          "globalCost": 38415
        },
        {
          "id": 53067,
          "qty": 25,
          "name": "Striped Lurker",
          "realmCost": 500,
          "globalCost": 23200
        },
        {
          "id": 53072,
          "qty": 25,
          "name": "Deepsea Sagefish",
          "realmCost": 500,
          "globalCost": 43065
        }
      ]
    }
  }
};

app.get('/', function(req, res){
  RealmProvider.findAll(function(err, realms){
    res.render('index.jade', { title: '', realms:realms, collection:JSON.stringify(realms) });
  });
});

app.get('/realm/:id', function(req, res){
  RealmProvider.findById(req.params.id, function(error, realm) {

    console.log('[REALM: ' + realm.name + ']\n\n');

    var file, lastModified, auctions;

    try {

      armory.auction(realm.name, function(err, urls) {
          
          file         = urls[0].url;

          lastModified = urls[0].lastModified;

          console.log('[PULL REMOTE: CHECKING LAST-MODIFIED]\n\n');

          armory.auctionData({
              
              lastModified: lastModified,
              
              name: realm.name              
          
          }, function(err, response) {          
              if( err ) return;

              console.log('[RESPONSE TYPE: ' + typeof response + ']');

              if( typeof response == 'object' && response ) {

                var neutral  = response.neutral;
                var alliance = response.alliance;
                var horde    = response.horde;
                var name     = response.realm.name;

                console.log('\nAlliance = ' + alliance,
                            '\nHorde    = ' + horde + '\n\n');

                AuctionProvider.save(response, req.params.id, function(err, doc) {

                  console.log('[SAVING]\n\n');

                });

                res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response), professions:JSON.stringify(ProfessionsProvider) });
              
              } else {

                console.log('[PULL LOCAL]\n\n');

                AuctionProvider.findByName(realm.name, function(error, response) {
                  if( error ) return;
                  
                  console.log('[RESPONSE TYPE: ' + typeof response + ']');

                  if( typeof response == 'object' && response ) {
                  
                    res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response), professions:JSON.stringify(ProfessionsProvider) });
                  
                  } else {

                    console.log('[PULL REMOTE: NOT CHECKING LAST-MODIFIED]\n\n');

                    armory.auctionData({
                        
                        name: realm.name              
                    
                    }, function(err, response) {          
                        if( err ) return;

                        console.log('[RESPONSE TYPE: ' + typeof response + ']');

                        if( typeof response == 'object' && response ) {

                          var neutral  = response.neutral;
                          var alliance = response.alliance;
                          var horde    = response.horde;
                          var name     = response.realm.name;

                          console.log('\nAlliance = ' + alliance,
                                      '\nHorde    = ' + horde + '\n\n');

                          AuctionProvider.save(response, req.params.id, function(err, doc) {

                            console.log('[SAVING]\n\n');

                          });

                          res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify(response), professions:JSON.stringify(ProfessionsProvider) });

                        } else {

                          console.log('[DEFAULT: RENDER WITH NO AUCTIONS]\n\n');
                          res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}), professions:JSON.stringify(ProfessionsProvider) });

                        }

                    });

                  }

                });

              }

          });

      });

    } catch(e) {

      console.log('[NO API RESPONSE: RENDER WITH NO AUCTIONS]\n\n');
      res.render('realm_show.jade', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}), professions:JSON.stringify(ProfessionsProvider) });
    
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

          console.log('\n[SAVE]------------------\n');
          console.log('\n' + realm + '\n');
          console.log('\n[END]-------------------\n');

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

    console.log('GET /auctions/all -- [DONE]');

    res.send('All done');
    
  });
})

app.get('/auctions/:id', function(req, res) {
  RealmProvider.findById(req.params.id, function(err, realms) {

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

    console.log('GET /auctions/' + req.params.id + ' -- [DONE]');

    res.send('All done');
    
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

RealmProvider =  function(host, port) {
  this.db= new Db('test', new Server(host, port, {auto_reconnect: true}, {}), {safe: true});
  this.db.open(function(){});
};

RealmProvider.prototype.getCollection= function(callback) {
  this.db.collection('realms', function(error, realms_collection) {
    if( error ) callback(error);
    else callback(null, realms_collection);
  });
};

RealmProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, realms_collection) {
    if( error ) callback(error)
    else {
      realms_collection.find().sort({name:1}).toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

RealmProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, realms_collection) {
    if( error ) callback(error)
    else {
      realms_collection.findOne({_id: realms_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

RealmProvider.prototype.save = function(realms, callback) {
  this.getCollection(function(error, realms_collection) {
    if( error ) callback(error)
    else {
      if( typeof(realms.length)=="undefined")
        realms = [realms];

      for( var i =0;i< realms.length;i++ ) {
        realm = realms[i];
        realm.created_at = new Date();

        // GET auctions

        realm.alliance = [];
        realm.horde = [];
        realm.neutral = [];
        realm.professions =
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
      }

      realms_collection.update({name: realm.name}, realm, { upsert: true }, function() {        
        callback(null, realms);
      });
    }
  });
};

exports.RealmProvider = RealmProvider;
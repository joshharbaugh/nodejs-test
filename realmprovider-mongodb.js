var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , BSON = require('mongodb').BSON
  , ObjectID = require('mongodb').ObjectID;

RealmProvider =  function(host, port) {
  this.db= new Db('test', new Server(host, port, {auto_reconnect: true}, {}), {safe: true});
  this.db.open(function(){});
};

RealmProvider.prototype.getCollection = function(callback) {
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
      realms_collection.findOne({_id: id}, function(error, result) {
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
        realm.created_at = new Date().toUTCString();
        realm.professionCost = [
          {
            "_id": "alchemy",
            "alliance": 3000,
            "horde": 2500,
            "items": [{ "_id" : 765, "available": 0, "realmCost" : 2140 }, { "_id" : 2450, "available": 0, "realmCost" : 10877 }, { "_id" : 2453, "available" : 0, "realmCost" : 8336 }, { "_id" : 785, "available" : 20, "realmCost" : 6767 }, { "_id" : 3820, "available" : 45, "realmCost" : 12000 }, { "_id" : 2447, "available" : 59, "realmCost" : 2557 }, { "_id" : 3357, "available" : 20, "realmCost" : 9900 }, { "_id" : 3821, "available" : 55, "realmCost" : 44214 }, { "_id" : 8838, "available" : 55, "realmCost" : 11756 }, { "_id" : 8839, "available" : 15, "realmCost" : 19550 }, { "_id" : 13463, "available" : 15, "realmCost" : 9287 }, { "_id" : 13465, "available" : 18, "realmCost" : 12798 }, { "_id" : 22789, "available" : 10, "realmCost" : 23013 }, { "_id" : 22791, "available" : 10, "realmCost" : 33500 }, { "_id" : 40199, "available" : 5, "realmCost" : 3463 }, { "_id" : 36904, "available" : 30, "realmCost" : 8927 }, { "_id" : 36906, "available" : 20, "realmCost" : 12352 }, { "_id" : 52983, "available" : 69, "realmCost" : 25046 }, { "_id" : 52985, "available" : 39, "realmCost" : 62142 }, { "_id" : 52329, "available" : 5, "realmCost" : 70814 }, { "_id" : 52988, "available" : 23, "realmCost" : 39752 }, { "_id" : 52179, "available" : 15, "realmCost" : 119497 }, { "_id" : 3356, "available" : 30, "realmCost" : 9413 }, { "_id" : 3358, "available" : 25, "realmCost" : 8160 }, { "_id" : 13466, "available" : 30, "realmCost" : 12450 }, { "_id" : 13464, "available" : 45, "realmCost" : 8678 }, { "_id" : 22785, "available" : 50, "realmCost" : 16475 }, { "_id" : 52181, "available" : 3, "realmCost" : 209500 }, { "_id" : 22786, "available" : 35, "realmCost" : 15231 }, { "_id" : 36907, "available" : 20, "realmCost" : 13600 }, { "_id" : 36901, "available" : 75, "realmCost" : 11133 }, { "_id" : 36903, "available" : 25, "realmCost" : 11277 }, { "_id" : 36905, "available" : 40, "realmCost" : 14175 }, { "_id" : 52984, "available" : 18, "realmCost" : 28571 }, { "_id" : 52986, "available" : 34, "realmCost" : 53755 }, { "_id" : 52987, "available" : 32, "realmCost" : 61577 }, { "_id" : 52178, "available" : 15, "realmCost" : 164937 }]
          },
          {
            "_id": "blacksmithing",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "cooking",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "enchanting",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "engineering",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "inscription",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "jewelcrafting",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "leatherworking",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          },
          {
            "_id": "tailoring",
            "alliance": 3000,
            "horde": 2500,
            "items": []
          }
        ];
      }

      realms_collection.update({_id: realm.slug}, realm, { upsert: true }, function() {        
        callback(null, realms);
      });
    }
  });
};

exports.RealmProvider = RealmProvider;
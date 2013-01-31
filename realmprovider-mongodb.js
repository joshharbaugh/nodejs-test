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
      realms_collection.find().toArray(function(error, results) {
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
      }

      realms_collection.update({name: realm.name}, realm, { upsert: true }, function() {
        callback(null, realms);
      });
    }
  });
};

exports.RealmProvider = RealmProvider;
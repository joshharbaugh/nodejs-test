var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ProfessionProvider =  function(host, port) {
  this.db= new Db('test', new Server(host, port, {auto_reconnect: true}, {}), {safe: true});
  this.db.open(function(){});
};

ProfessionProvider.prototype.getCollection= function(callback) {
  this.db.collection('professions', function(error, auctions_collection) {
    if( error ) callback(error);
    else callback(null, auctions_collection);
  });
};

ProfessionProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, auctions_collection) {
    if( error ) callback(error)
    else {
      auctions_collection.find().toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

ProfessionProvider.prototype.findByName = function(name, callback) {
  this.getCollection(function(error, auctions_collection) {
    if( error ) callback(error)
    else {
      auctions_collection.findOne({'realm.name': name}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

ProfessionProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, auctions_collection) {
    if( error ) callback(error)
    else {
      auctions_collection.findOne({_id: auctions_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

ProfessionProvider.prototype.save = function(auctionData, id, callback) {
  this.getCollection(function(error, auctions_collection) {
    if( error ) callback(error)
    else {

      auctionData.created_at = new Date().toUTCString();

      auctions_collection.update({_id: auctions_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, auctionData, { upsert: true }, function() {
        callback(null, auctionData);
      });
    }
  });
};

exports.ProfessionProvider = ProfessionProvider;
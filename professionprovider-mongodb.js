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
  this.db.collection('professions', function(error, professions_collection) {
    if( error ) callback(error);
    else callback(null, professions_collection);
  });
};

ProfessionProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {
      professions_collection.find().sort({name:1}).toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

ProfessionProvider.prototype.findByName = function(name, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {
      professions_collection.findOne({name: name}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

ProfessionProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {
      professions_collection.findOne({_id: professions_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

ProfessionProvider.prototype.save = function(id, payload, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {

      payload.created_at = new Date().toUTCString();

      professions_collection.update({_id: professions_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, {$push: {"items": payload} }, { upsert: true }, function() {
        callback(null, "success");
      });
    }
  });
};

exports.ProfessionProvider = ProfessionProvider;
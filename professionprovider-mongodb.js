var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    WowHead = require('wowhead');

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
      professions_collection.findOne({_id: id}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

ProfessionProvider.prototype.create = function(id, payload, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {

      payload.created_at = new Date().toUTCString();

      professions_collection.update({_id: id}, payload, { upsert: true }, function() {
        callback(null, "success");
      });
    }
  });
};

ProfessionProvider.prototype.update = function(id, payload, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {

      payload.modified_at = new Date().toUTCString();

      professions_collection.update({_id: id}, {$set: {"name": payload.name} }, { upsert: true }, function() {
        callback(null, "success");
      });
    }
  });
};

ProfessionProvider.prototype.destroy = function(id, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {
      professions_collection.remove({_id: id}, function() {
        callback(null, "success");
      });
    }
  })
}

ProfessionProvider.prototype.updateItems = function(id, payload, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {

      professions_collection.update({_id: id}, {$push: {"items": payload} }, { upsert: true }, function() {
        callback(null, payload);
      });
    
    }
  });
};

ProfessionProvider.prototype.deleteItem = function(id, payload, callback) {
  this.getCollection(function(error, professions_collection) {
    if( error ) callback(error)
    else {
      professions_collection.update({_id: id}, {$pull: {"items": payload} }, function() {
        callback(null, "success");
      });
    }
  })
}

exports.ProfessionProvider = ProfessionProvider;
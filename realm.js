var RealmProvider = require('./realmprovider-mongodb').RealmProvider
  , request = require('request');
var RealmProvider = new RealmProvider('localhost', 27017);

exports.index = function(req, res) {
	RealmProvider.findAll(function(err, realms){
		res.render('index', { title: '', realms:realms, collection:JSON.stringify(realms) });
	});
}

exports.list = function(req, res) {
	request('http://us.battle.net/api/wow/realm/status', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var resp = JSON.parse(body);

			for (var key in resp.realms) {
				var realm = resp.realms[key];
				RealmProvider.save(realm, function(err, doc) {
					console.log('\n[SAVE]------------------\n');
					console.log('\n' + doc[0].name + '\n');
				});
			}
			res.redirect('/');
		}
	});
}

exports.read = function(req, res) {
	RealmProvider.findById(req.params.id, function(error, realm) {
		if( error ) res.send(500, error);
		console.log('[REALM: ' + realm.name + ']\n\n');
		res.render('realm_show', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}), professions:JSON.stringify(realm.professions) });
	});
}
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

exports.create = function(req, res) {
	request('http://us.battle.net/api/wow/realm/status', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var resp = JSON.parse(body);

			for (var key in resp.realms) {
				var realm = resp.realms[key];
				RealmProvider.create(realm, function(err, doc) {
					console.log('\n[SAVE]------------------\n');
					console.log('\n' + doc[0].name + '\n');
				});
			}
			res.redirect('/');
		}
	});
}

exports.read = function(req, res) {

	res.app.db.models.Realm.findOne({_id: req.params.id}).exec(function(err, realm) {
		if( err ) res.send(500, err);
        else {

        	try {

        		res.app.db.models.Professions.find().sort('name').exec(function(err, professions) {

        			if (err) throw err;

        			for (var obj in professions) {

        				if(professions.hasOwnProperty(obj)) {

		        			realm.professions.push(professions[obj]);
		        		
		        		}

	        		}

	        		console.log('[REALM: ' + realm.name + ']\n\n');
	        		res.render('realm_show', { title: realm.name, realm:realm, document:JSON.stringify(realm), auctions:JSON.stringify({}), professions:JSON.stringify(realm.professions), professionCost:JSON.stringify(realm.professionCost) });

        		});

	        } catch(e) {

	        	console.log('Exception: ' + e);

	        }

        }
    });

}

exports.addItem = function(req, res) {
	var b = req.body;

	RealmProvider.addItem(req.params.id, b, function(err, resp) {
		if ( err ) throw err;
		else {
			console.log('The raw response from Mongo was ', resp);
			res.json(resp);
		}
	});
}

exports.deleteItem = function(req, res) {
	var b = req.body;

	console.log(req.params.id);

	console.log(b, req.body);

	RealmProvider.deleteItem(req.params.id, b, function(err, resp) {
		if ( err ) throw err;
		res.send(resp);
	})
}
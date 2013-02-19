var RealmProvider = require('./realmprovider-mongodb').RealmProvider
  , ProfessionProvider = require('./professionprovider-mongodb').ProfessionProvider
  , request = require('request')
  , armory = require('armory');

var RealmProvider = new RealmProvider('localhost', 27017);
var ProfessionProvider = new ProfessionProvider('localhost', 27017);

exports.log = function(req, res) {

	var limit = req.params.limit;
	var url = 'http://pixelhaven.loggly.com/api/search?timestamp_format=unixmillis&rows=' + limit;

	request({
		'method': 'GET',
		'uri': url,
		'headers': {
			'Authorization': 'Basic ' + new Buffer('joshharbaugh:sabbath83').toString('base64')
		}
	}, function(error, response, body) {

		if(error) res.send(500, error);
		else res.json(JSON.parse(body));

	});

}

exports.index = function(req, res) {
	ProfessionProvider.findAll(function(err, professions) {
		res.render('admin/index', { title: '', manage: '', bootstrap: JSON.stringify(professions), professions: professions });
	});
}

exports.list = function(req, res) {

	var realmName = req.params.name;
	var items;
	console.log('[REALM: ' + realmName + ']\n\n');

	try {

		request.get('http://localhost:3000/admin/items', function(error, response, body) {

			if(error) throw error;
			else {

				items = JSON.parse(body);

			}

		});

		armory.auctionData({name: realmName, region: 'us'}, function(err, response) {
			if ( err ) console.log(err);

			var filtered = [];
			
			for (var key in items) {

				if(items.hasOwnProperty(key)) {

					var subtotal = 0;
					var filter = response.alliance.auctions.filter(function(auction) {
						return auction.item === items[key];
					});

					console.log('\n------------------------------[ GROUP ]------------------------------\n');
					console.log('Length  : ', filter.length, '\n');

					for(var object in filter) {
						if(filter.hasOwnProperty(object)) {
							console.log('\n');
							console.log(filter[object].item, Math.ceil(filter[object].buyout / filter[object].quantity), filter[object].owner);
							subtotal += Math.ceil(filter[object].buyout / filter[object].quantity);
							console.log('\nSubtotal: ', subtotal, '\n');
						}
					}
					if (filter.length > 0) {
						var totalCost = Math.ceil(subtotal / filter.length);
						console.log('Total Cost = ', totalCost);
					} else {
						var totalCost = 0;
					}
					filtered.push({"id":items[key], "realmCost":totalCost});

				}

			}

			console.log(filtered);

			res.json(filtered);
			//res.render('admin/realm_show', { title: realmName, filter: JSON.stringify(filtered), realm:realmName, manage:realmName, bootstrap: JSON.stringify(realmName), document:JSON.stringify(realmName), professions:JSON.stringify(realmName) });
		});
	} catch(e) {
		res.send(500, e);
		//res.render('admin/realm_show', { title: realmName, filter:'', realm:realmName, manage:realmName, bootstrap: JSON.stringify(realmName), document:JSON.stringify(realmName), auctions:JSON.stringify(response), professions:JSON.stringify(realmName) });
	}
}

exports.read = function(req, res) {
	switch(req.params.id) {
		case 'realms' :
			var realms;
			res.render('admin/edit', { title: '', manage: 'Realms', bootstrap: JSON.stringify(realms) });
			break;
		default :
			var profession = req.params.id;
			ProfessionProvider.findById(profession, function(err, profession){
				res.render('admin/edit', { title: '', manage: profession.name, bootstrap: JSON.stringify(profession), profession: profession, items: profession.items });
			});
	}
}

exports.update = function(req, res) {

	var objectId = req.body.professionId;
	var payload = req.body;
	console.log(objectId);
	console.log(payload);
	
	ProfessionProvider.save(objectId, payload, function(err, resp) {
		if ( err ) throw err;
		res.redirect('/admin/edit/' + objectId);	
	});

}

exports.delete = function(req, res) {

	var objectId = req.body.professionId;
	var payload = req.body;
	console.log(objectId);
	console.log(payload);

	ProfessionProvider.delete(objectId, payload, function(err, resp) {
		if ( err ) throw err;
		res.redirect('/admin/edit/' + objectId);
	});
	
	//ProfessionProvider.delete()
}
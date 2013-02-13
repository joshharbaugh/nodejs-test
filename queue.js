exports = module.exports = function(app) {

	var kue     = require('kue')
	  , request = require('request')
	  , crypto  = require('crypto');

	var jobs   = kue.createQueue()
	  , Job    = kue.Job
	  , realms = [];

	// pull from db
	app.db.models.Realm.find({}, {_id: 0, 'slug': 1}).limit(1).exec(function(err, data) {

		if (err) return err;
		
		else {

			for(var key in data) {

				if(data.hasOwnProperty(key)) {

					realms.push(data[key].slug);

				}

			}

			request.get('http://localhost:3000/admin/items', function(error, response, body) {

				if(error) throw error;
				else {

					var items = JSON.parse(body);
					getAuctionData(items);

				}

			});

		}

	});

	// function to create task
	function getAuctionData(items) {

		if (realms.length > 0 && typeof realms != 'undefined') {

			for(var key in realms) {
				
				if(realms.hasOwnProperty(key)) {
				
					var job = jobs.create('realm', {
						title: 'Downloading ' + realms[key] + '',
						slug: realms[key]
					}).attempts(5).save();

					job.on('complete', function(){
						console.log("Job complete\n\n");
					}).on('failed', function(){
						job.log('Job failed: ', job.id);
					});

				}
			}

			setTimeout(getAuctionData, 86400000);

		}

		// task processor
		jobs.process('realm', 5, function(job, done) {

			var slug  = job.data.slug;

			function next(i) {

				try {

					console.log('\n[STEP 1]----------------------------------------\n');
					console.log('Processing... ' + slug);

					var remoteUrl = 'http://us.battle.net/api/wow/auction/data/' + slug;

					var signature = crypto.createHmac('sha1', 'UL7D3D3U9LZ9');

			        signature.update(
			            'GET' + '\n' +
			            new Date().toUTCString() + '\n' +
			            '/api/wow/auction/data/' + slug + '\n'
			        );

			        var headers = {'auth': 'BNET CAUS5YMFED6D:' + signature.digest('base64') + ''};

					request.get(remoteUrl, {headers: headers}, function(err, response, body) {

						if (err) {
							console.log('remote error', err);
							done(err);
						}

						//console.log(response.headers);
						//console.log(body);

			  			if (!err && response.statusCode == 200) {

			  				console.log('\n[STEP 2]----------------------------------------\n');
			  				console.log('Remote data received.');
			  				console.log('\n', response.headers);
			  				//console.log('\n', response.body);
			  				
			  				try {

			  					var data        = JSON.parse(body);
			  					var auctionFile = data.files[0].url;

			  					request.get(auctionFile, {headers: headers}, function(e, r, b) {
		  						
			  						if (e) {
			  							console.log('error', e);
			  							done(e);
			  						}

			  						if (!e && r.statusCode == 200) {

			  							console.log('\n[STEP 3]----------------------------------------\n');
			  							console.log("Remote JSON received successfully from " + auctionFile);
			  							job.log('Responded with a status code: ' + r.statusCode + '\n');
			  							job.log('JSON file: ' + auctionFile);

			  							if (b.length > 0) {
			  								try {
				  								var schema = JSON.parse(b);
				  								var query = { '_id': slug };
				  								var filteredAlliance = [];
				  								var filteredHorde = [];
				  								var filteredNeutral = [];

				  								for (var key in items) {

				  									if(items.hasOwnProperty(key)) {

						  								var subtotal = 0;
														var filter = schema.alliance.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														console.log('\n------------------------------[ ALLIANCE GROUP ]------------------------------\n');
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
														filteredAlliance.push({"_id":items[key], "realmCost":totalCost});

						  							}

						  						}

						  						for (var key in items) {

				  									if(items.hasOwnProperty(key)) {

						  								var subtotal = 0;
														var filter = schema.horde.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														console.log('\n------------------------------[ HORDE GROUP ]------------------------------\n');
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
														filteredHorde.push({"_id":items[key], "realmCost":totalCost});

						  							}

						  						}

						  						for (var key in items) {

				  									if(items.hasOwnProperty(key)) {

				  										var subtotal = 0;
														var filter = schema.neutral.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														console.log('\n------------------------------[ NEUTRAL GROUP ]------------------------------\n');
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
														filteredNeutral.push({"_id":items[key], "realmCost":totalCost});

						  							}

						  						}

						  						/*app.db.models.Realm.update({ "_id": slug, "professionCost.items._id": req.params.name }, { $push: { "professionCost.$.items": { _id:payload._id, available:0, realmCost: { alliance: payload.globalCost, horde: payload.globalCost } } } }, {upsert: true, multi: true}, function(error) {
													if( error ) res.send(500, error)
													else res.json({"_id":payload._id, "qty":payload.qty, "globalCost":payload.globalCost});
												});*/

						  						app.db.models.Auction.findOneAndUpdate(query, { $set: { realm: schema.realm, alliance: filteredAlliance, horde: filteredHorde, neutral: filteredNeutral } }, { upsert: true }, function(err, res) {
											  		if (err) next(i + 1);
											  		if (res) done();
											  		else next(i + 1);
											  	});

						  					} catch(e) { console.log('Error on Step 3', e); done(e); }

							  			}

			  						} else { console.log('general error'); done(); }

			  					});

			  				} catch(e) { console.log('Error on Step 2', e); done(e); }

			  			}

					});

				} catch(e) { console.log('Error on Step 1', e); done(e); }

			}

			next(0);

		});

		// remove stale jobs
		/*jobs.on('job complete', function(id){
			Job.get(id, function(err, job){
				if (err) return;
				job.remove(function(err){
					if (err) throw err;
					console.log('Removed completed job #%d', job.id);
				});
			});
		});*/

		// setup Kue UI
		kue.app.listen(3001);
		console.log('Kue started on port 3001');

	}

}
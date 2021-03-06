exports = module.exports = function(app, logger) {

	var kue     = require('kue')
	  , request = require('request')
	  , crypto  = require('crypto')
	  , cluster = require('cluster')
	  , zlib    = require('zlib');

	//redis config goes here

	var jobs   = kue.createQueue()
	  , Job    = kue.Job
	  , realms = [];

	request.get('http://localhost:3000/admin/items', function(error, response, body) {

		if (error) return error;

		else {

			var items = JSON.parse(body);
			getAuctionData(items);

		}

	});

	function getAuctionData(items) {

		app.db.models.Realm.find({}, {_id: 0, 'slug': 1}).exec(function(err, realms) {

			if (err) return err;
			
			else {

				for(var key in realms) {
					
					if(realms.hasOwnProperty(key)) {
					
						var job = jobs.create('realm', {
							title: 'Downloading ' + realms[key].slug + '',
							slug: realms[key].slug
						}).attempts(5).save();

						job.on('complete', function() {
							console.log(new Date().toUTCString() + ': Job complete.');
						}).on('failed', function(){
							job.log('Job failed: ', job.id);
							logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '[JOB '+job.id+'] Failed.');
						});

					}
				}

				setTimeout(function(){ getAuctionData(items) }, 1200000); //86400000

			}

		});

		// task processor
		jobs.process('realm', 5, function(job, done) {

			var slug  = job.data.slug;

			function next(i) {

				try {

					//console.log('\n[STEP 1]----------------------------------------\n');
					//console.log('Processing... ' + slug);
					logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] Processing...');

					var remoteUrl = 'http://us.battle.net/api/wow/auction/data/' + slug;

					//console.log('GET' + '\n' + new Date().toUTCString() + '\n' + '/api/wow/auction/data/' + slug + '\n');

					var signature =
						crypto.createHmac('sha1', 'UL7D3D3U9LZ9')
						.update('GET' + '\n' + new Date().toUTCString() + '\n' + '/api/wow/auction/data/' + slug + '\n')
			            .digest('base64');

			        //var headers = {'auth': 'BNET CAUS5YMFED6D:' + signature.digest('base64') + ''};

			        //console.log(signature);

					request({
						'method': 'GET',
						'uri': remoteUrl,
						'headers': {
							'Content-Type': 'application/json; charset=utf-8',
							'Date': new Date().toUTCString(),
							'Authorization': 'BNET CAUS5YMFED6D:' + signature
						}
					}, function(err, response, body) {

						if (err) {
							console.log('remote error', err);
							logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] Remote error: ' + err);
							done(err);
						}

						//console.log(response);
						//console.log(body);

			  			if (!err && response.statusCode == 200) {

			  				//console.log('\n[STEP 2]----------------------------------------\n');
			  				//console.log('Remote data received.');
			  				//console.log('\n', response.headers);
			  				logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] Remote data received');
			  				//console.log('\n', response.body);
			  				
			  				try {

			  					var data        = JSON.parse(body);
			  					var auctionFile = data.files[0].url;

			  					request({
			  						'method': 'GET',
			  						'uri': auctionFile,
			  						'headers': {
			  							'Content-Type': 'application/json; charset=utf-8',
			  							'Date': new Date().toUTCString(),
			  							'Authorization': 'BNET CAUS5YMFED6D:' + signature
			  						}
			  					}, function(e, r, b) {
		  						
			  						if (e) {
			  							//console.log('error', e);
			  							logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] Error: ' + e);
			  							done(e);
			  						}

			  						if (!e && r.statusCode == 200) {

			  							//console.log('\n[STEP 3]----------------------------------------\n');
			  							//console.log("Remote JSON received successfully from " + auctionFile);
			  							//job.log('Status code: ' + r.statusCode + '\n');
			  							//job.log('JSON file: ' + auctionFile);
			  							logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] Remote JSON received successfully from ' + auctionFile + ', Status code: ' + r.statusCode);

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
						  								var available = 0;
														var filter = schema.alliance.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														//console.log('\n------------------------------[ ALLIANCE GROUP ]------------------------------\n');
														//console.log('Length  : ', filter.length, '\n');

														for(var object in filter) {
															if(filter.hasOwnProperty(object)) {
																//console.log('\n');
																//console.log(filter[object].item, Math.ceil(filter[object].buyout / filter[object].quantity), filter[object].owner);
																subtotal += Math.ceil(filter[object].buyout / filter[object].quantity);
																available += Math.ceil(filter[object].quantity);
																//console.log('\nSubtotal: ', subtotal, '\n');
															}
														}
														if (filter.length > 0) {
															var totalCost = Math.ceil(subtotal / filter.length);
															//console.log('Total Cost = ', totalCost);
														} else {
															var totalCost = 0;
														}
														filteredAlliance.push({"_id":items[key], "realmCost":totalCost, "available": available});

						  							}

						  						}

						  						for (var key in items) {

				  									if(items.hasOwnProperty(key)) {

						  								var subtotal = 0;
						  								var available = 0;
														var filter = schema.horde.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														//console.log('\n------------------------------[ HORDE GROUP ]------------------------------\n');
														//console.log('Length  : ', filter.length, '\n');

														for(var object in filter) {
															if(filter.hasOwnProperty(object)) {
																//console.log('\n');
																//console.log(filter[object].item, Math.ceil(filter[object].buyout / filter[object].quantity), filter[object].owner);
																subtotal += Math.ceil(filter[object].buyout / filter[object].quantity);
																available += Math.ceil(filter[object].quantity);
																//console.log('\nSubtotal: ', subtotal, '\n');
															}
														}
														if (filter.length > 0) {
															var totalCost = Math.ceil(subtotal / filter.length);
															//console.log('Total Cost = ', totalCost);
														} else {
															var totalCost = 0;
														}
														filteredHorde.push({"_id":items[key], "realmCost":totalCost, "available": available});

						  							}

						  						}

						  						for (var key in items) {

				  									if(items.hasOwnProperty(key)) {

				  										var subtotal = 0;
				  										var available = 0;
														var filter = schema.neutral.auctions.filter(function(auction) {
															return auction.item === items[key];
														});

														//console.log('\n------------------------------[ NEUTRAL GROUP ]------------------------------\n');
														//console.log('Length  : ', filter.length, '\n');

														for(var object in filter) {
															if(filter.hasOwnProperty(object)) {
																//console.log('\n');
																//console.log(filter[object].item, Math.ceil(filter[object].buyout / filter[object].quantity), filter[object].owner);
																subtotal += Math.ceil(filter[object].buyout / filter[object].quantity);
																available += Math.ceil(filter[object].quantity);
																//console.log('\nSubtotal: ', subtotal, '\n');
															}
														}
														if (filter.length > 0) {
															var totalCost = Math.ceil(subtotal / filter.length);
															//console.log('Total Cost = ', totalCost);
														} else {
															var totalCost = 0;
														}
														filteredNeutral.push({"_id":items[key], "realmCost":totalCost, "available": available});

						  							}

						  						}

						  						/*app.db.models.Realm.update({ "_id": slug, "professionCost.items._id": req.params.name }, { $push: { "professionCost.$.items": { _id:payload._id, available:0, realmCost: { alliance: payload.globalCost, horde: payload.globalCost } } } }, {upsert: true, multi: true}, function(error) {
													if( error ) res.send(500, error)
													else res.json({"_id":payload._id, "qty":payload.qty, "globalCost":payload.globalCost});
												});*/

												var currentDate = new Date().toUTCString();

						  						app.db.models.Auction.findOneAndUpdate(query, { $set: { last_modified: currentDate, realm: schema.realm, alliance: filteredAlliance, horde: filteredHorde, neutral: filteredNeutral } }, { upsert: true }, function(err, res) {
											  		if (err) next(i + 1);
											  		if (res) {
											  			job.log('Modified: ' + currentDate);
											  			done();											  			
											  		}
											  		else next(i + 1);
											  	});

						  					} catch(e) { 
						  						//console.log('Error on Step 3', e);
						  						logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', 'Error on step 3: ' + e);
						  						done(e);
						  					}

							  			}

			  						} else { job.log('general error'); logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', '['+slug+'] General Error: Probably a 302 Redirect to an internal error page.'); done(); }

			  					});

			  				} catch(e) { 
			  					//console.log('Error on Step 2', e);
			  					logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', 'Error on step 2: ' + e);
			  					done(e);
			  				}

			  			}

					});

				} catch(e) { 
					//console.log('Error on Step 1', e);
					logger.log('1dac1c85-be1f-4206-8377-80e852a59aa0', 'Error on step 1: ' + e);
					done(e);
				}

			}

			next(0);

		});

	}

	// remove completed jobs
	jobs.on('job complete', function(id){
		Job.get(id, function(err, job){
			if (err) return;
			job.remove(function(err){
				if (err) throw err;
				//console.log('Removed completed job #%d', job.id);
			});
		});
	});

	kue.app.set('title', 'Warcraft Professional Job Queue');
	kue.app.listen(3001);

}
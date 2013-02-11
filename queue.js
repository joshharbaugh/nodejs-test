exports = module.exports = function(app) {

	var kue     = require('kue')
	  , request = require('request')
	  , crypto  = require('crypto');

	var jobs   = kue.createQueue()
	  , Job    = kue.Job
	  , realms = [];

	// pull from db
	app.db.models.Realm.find({}, {_id: 0, 'slug': 1}).exec(function(err, data) {

		if (err) return err;
		
		else {

			for(var key in data) {

				if(data.hasOwnProperty(key)) {

					realms.push(data[key].slug);

				}

			}

			downloadAuctionData();

		}

	});

	// function to create task
	function downloadAuctionData() {

		console.log('length of realms array', realms.length);

		if (realms.length > 0 && typeof realms != 'undefined') {

			for(var key in realms) {
				
				if(realms.hasOwnProperty(key)) {

					console.log('- creating job ' + realms[key]);
				
					var job = jobs.create('realm', {
						title: 'Downloading ' + realms[key] + '',
						slug: realms[key]
					}).attempts(5).save();

					job.on('complete', function(){
						console.log("Job complete");
					}).on('failed', function(){
						job.log('Job failed: ', job.id);
					}).on('progress', function(progress){
					  process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
					});

				}
			}

			setTimeout(downloadAuctionData, 86400000);

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

						if (err) next(i + 1);

						console.log(response.headers);
						console.log(body);

			  			if (!err && response.statusCode == 200) {

			  				console.log('\n[STEP 2]----------------------------------------\n');
			  				console.log('Remote data received.');
			  				console.log('\n', response.headers);
			  				console.log('\n', response.body);
			  				
			  				try {

			  					var data        = JSON.parse(body);
			  					var auctionFile = data.files[0].url;

			  					request.get(auctionFile, {headers: headers}, function(e, r, b) {
		  						
			  						if (e) next(i + 1);
			  						
			  						//console.log('\n[REQUEST HEADERS]--------------------------\n');
			  						//console.log(r.headers);

			  						if (!e && r.statusCode == 200) {

			  							console.log('\n[STEP 3]----------------------------------------\n');
			  							console.log("Remote JSON received successfully from " + auctionFile);

			  							done();

			  						} else {

			  							job.log('Responded with a redirect to an error page.');

			  							next(i + 1);

			  						}

			  					});

			  				} catch(e) {

			  					console.log('Error: ', e);

			  					next(i + 1);

			  				}

			  			}

					});

				} catch(e) {

					console.log('Error: ', e);

					next(i + 1);

				}

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
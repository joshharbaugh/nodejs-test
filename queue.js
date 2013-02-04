exports = module.exports = function(app) {

  var kue = require('kue')
    , request = require('request')
  	, fs = require('fs')
  ;
  //create queue object in app
  app.queue = {};
  
  //setup queues
  app.queue.create = require('./queue/create');
  app.queue.process = require('./queue/process');

  var jobs = kue.createQueue()
    , Job = kue.Job;

  //create job

  app.wowpro.models.Realm.find({}, {_id: 0, 'slug': 1}).exec(function(err, realms) {

  	function updateAll() {

	  	for (var realm in realms) {
	  		if(realms.hasOwnProperty(realm)) {
		  		console.log("- creating job %s", realms[realm].slug);

		  		var job = jobs.create('update realm', {
		  			title: realms[realm].slug
		  		  , url: __dirname + "/data/" + realms[realm].slug + ".json"
		  		  , slug: realms[realm].slug
		  		}).attempts(3).save();

		  		job.on('complete', function(){
				  console.log("Job complete");
				}).on('failed', function(){
				  console.log("Job failed");
				}).on('progress', function(progress){
				  process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
				});
		  	}
	  	}
	  	setTimeout(updateAll, 86400000); // 1 day

	}

    updateAll();

  });

  /*function create() {
	  var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
	  console.log('- creating job for %s', name);
	  jobs.create('video conversion', {
	      title: 'converting ' + name + '\'s to avi'
	    , user: 1
	    , frames: 200
	  }).save();
	  setTimeout(create, Math.random() * 3000 | 0);
  }

  create();*/

  //process job one at a time

  jobs.process('update realm', 3, function(job, done){
	  
	  var url = job.data.url;
	  var slug = job.data.slug;
	  var frames = job.data.frames;

	  console.log("job process %d ", job.id);
	  console.log("job process url ", url);
	  
	  function next(i) {

	  	try {

	  		/*
	  		 * Get remote file from
	  		 * Blizzard AH API
	  		 *
	  		 */

	  		var remoteUrl = 'http://us.battle.net/api/wow/auction/data/' + slug;

	  		request({url: remoteUrl, followRedirect: false}, function(err, response, body) {
	  			
	  			if (err) return done(err);

	  			if (!err && response.statusCode == 200) {

	  				try {
	  					console.log("Remote data received.");

	  					/*
	  					 * Read URL string and
	  					 * save local copy
	  					 * 
	  					 * @variables
	  					 * data, URL, headers
	  					 *
	  					 */
	  					var data = JSON.parse(body);
	  					var URL = data.files[0].url;
	  					var headers = {
	  						"Accept-Encoding": "gzip",
							"Content-Encoding": "gzip",
							"Content-Type": "application/json; charset=utf-8"
	  					};

	  					request({url: URL, followRedirect: false, headers: {}}, function(error, res, b) {
	  						
	  						if (error) return done(error);
	  						
	  						if (!error && res.statusCode == 200) {

	  							try {

	  								console.log("Remote JSON downloaded successfully from " + URL);

	  								processLocalFile();
	  							
	  							} catch(e) { done(e); }
	  						
	  						} else {

	  							// got an error page as a response
	  							return done();

	  						}

	  					}).pipe(fs.createWriteStream(url));

	  				} catch(e) { done(e); }
	  			}
            
            });

	  		/*
	  		 * read local file
	  		 * and save to mongodb
	  		 *
	  		 */

	  		function processLocalFile() {

	  			console.log("Processing local file");

		  		var fileContents = fs.readFile(url,'utf8', function(err, data) {

		  			if (err) return done(err);

		  			if (data.length > 0) {
		  				var schema = JSON.parse(data);
				  		var length = schema.length;
						var query = { 'realm.slug': slug };

					  	app.wowpro.models.Auction.findOneAndUpdate(query, { $set: schema }, { upsert: true }, function(err, res) {
					  		if (err) return done(err);
					  		if (res) done();
					  		else next(i + 1);
					  	});
		  			}
		  		});

		  	}

	  	} catch(e) { done(e); }

	  }

	  next(0);

  });

  // remove stale jobs
  jobs.on('job complete', function(id){
  	Job.get(id, function(err, job){
  		if (err) return;
  		job.remove(function(err){
  			if (err) throw err;
  			console.log('removed completed job #%d', job.id);
  		});
  	});
  });

  kue.app.set('title', 'Warcraft Professonal');
  kue.app.listen(8080, function() {
  	console.log("kue started");
  });
}
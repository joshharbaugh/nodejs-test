var util      = require('util'),
    httpAgent = require('http-agent'),
    request   = require('request');

var agent = httpAgent.create('us.battle.net', ['api/wow/auction/data/executus']);
  
agent.addListener('next', function (e, agent) {

	var headers = agent.response.headers;
	var json = JSON.parse(agent.body);

	for(var key in headers) {
		if(headers.hasOwnProperty(key)) {
			if (key === 'content-type' && headers[key] === 'application/json; charset=utf-8' || headers[key] === 'application/json;charset=UTF-8') {
				console.log('\n---------------------\n');
				
				console.log(headers[key]);

				console.log('\n---------------------\n');

				console.log(json, typeof json);

				console.log('\n---------------------\n');

				var auctionData = json.files[0].url;

				request(auctionData, function (error, response, body) {
					if (error) throw error;

					console.log(response.statusCode);

					if (!error && response.statusCode == 200) {
						var resp = JSON.parse(body);

						console.log(resp.realm, typeof resp.realm);
					}
				});
			}
		}
	}

	agent.next();
});

agent.addListener('stop', function (e, agent) {
	util.puts('Agent has completed visiting all urls');
});

// Start the agent
agent.start();
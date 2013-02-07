var wowhead = require('wowhead');

exports.create = function(req, res) {

	var payload = req.body;

	console.log(payload);

	payload._id = parseInt(req.body._id);
	payload.qty = parseInt(req.body.qty);

	wowhead(payload._id, function(err, response) {
		if ( err ) res.send(500, "wowhead error")
		else {
			payload.globalCost = response.avgbuyout || response.buyprice || 0;

			res.app.db.models.Professions.update({_id: req.params.name}, {$push: {"items": payload} }, { upsert: true }, function(error) {
				if( error ) res.send(500, error)
				else {
					res.app.db.models.Realm.update({ "professionCost._id": req.params.name }, { $push: { "professionCost.$.items": { _id:payload._id, available:0, realmCost:payload.globalCost } } }, {upsert: true, multi: true}, function(error) {
						if( error ) res.send(500, error)
						else res.json({"_id":payload._id, "qty":payload.qty, "globalCost":payload.globalCost});
					});
				}
			});
		}
	});

}

exports.update = function(req, res) {

	var payload = req.body;
	console.log(payload);

	res.app.db.models.Professions.update({_id: req.params.name, "items._id": req.params.id}, { $set: { "items.$": payload } }, { upsert: false }, function(error) {
		if( error ) res.send(500, error)
		else res.send("success")
	});

}

exports.delete = function(req, res) {

	var payload = req.body;

	console.log(payload);

	res.app.db.models.Professions.update({_id: req.params.name}, { $pull: { "items": payload } }, {upsert: false, multi: true}, function(error) {
        if( error ) res.send(500, error)
		else {
			res.app.db.models.Realm.update({ "professionCost._id": req.params.name, "professionCost.items._id": req.params.id }, { $pull: { "professionCost.$.items": {"_id": req.params.id} } }, {upsert: false, multi: true}, function(error) {
				if( error ) res.send(500, error)
				else res.send(200, "success")
			});
		}
	});

}
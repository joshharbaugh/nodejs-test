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
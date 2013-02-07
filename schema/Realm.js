exports = module.exports = function(app, mongoose) {

	var RealmSchema = new mongoose.Schema({
		_id: String,
		name: String,
		slug: String,
		professions: [{ _id: String, name: String, items: [{ _id: Number, qty: Number, globalCost: Number }] }],
		professionCost: [{ _id: String, alliance: Number, horde: Number, items: [{ _id: Number, available: Number, realmCost: Number }] }]
	});

	app.db.model('Realm', RealmSchema);

}
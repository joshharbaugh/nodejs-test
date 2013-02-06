exports = module.exports = function(app, mongoose) {

	var RealmSchema = new mongoose.Schema({
		_id: String,
		name: String,
		slug: String,
		professions: [{ _id: String, name: String, items: [{ _id: Number, qty: Number, globalCost: Number }] }],
		professionCost: { 
			alchemy: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			blacksmithing: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			cooking: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			enchanting: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			engineering: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			inscription: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			jewelcrafting: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			leatherworking: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] },
			tailoring: { _id: String, alliance: Number, horde: Number, items: [{ _id: Number, realmCost: Number, available: Number }] }
		}
	});

	app.db.model('Realm', RealmSchema);

}
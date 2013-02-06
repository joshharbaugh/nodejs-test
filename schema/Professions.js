exports = module.exports = function(app, mongoose) {

	var ProfessionsSchema = new mongoose.Schema({
		_id: String,
		name: String,
		items: [{ _id: Number, qty: Number, globalCost: Number }]
	});

	app.db.model('Professions', ProfessionsSchema);

}
exports = module.exports = function(app, mongoose) {
	
	// professions db schema
	require('./schema/Professions')(app, mongoose);

	// realm db schema
	require('./schema/Realm')(app, mongoose);

}
exports = module.exports = function(app, realm, admin, profession, item) {

	// SETTING CONTENT-TYPE FOR ALL RESPONSES TO APPLICATION/JSON
	// app.get('/*', function(req, res, next) { res.contentType('application/json'); next(); });
	// app.post('/*', function(req, res, next) { res.contentType('application/json'); next(); });
	// app.put('/*', function(req, res, next) { res.contentType('application/json'); next(); });
	// app.delete('/*', function(req, res, next) { res.contentType('application/json'); next(); });

	// FRONT-END ROUTES
	app.get('/', realm.index);
	app.get('/realm/:id', realm.read);
	app.get('/realms', realm.list);

	// BACK-END ROUTES
	app.get('/admin', admin.index);
	app.get('/admin/auctions/:name', admin.list);

	// PROFESSIONS
	app.get('/admin/professions', profession.index);
	app.get('/admin/profession', profession.show);
	app.post('/admin/profession', profession.create);
	app.get('/admin/profession/:id', profession.read);
	app.put('/admin/profession/:id', profession.update);
	app.delete('/admin/profession/:id', profession.delete);

	// ITEM
	app.get('/admin/items', item.index);
	app.post('/admin/:name/item/create', item.create);
	app.put('/admin/:name/item/:id', item.update);
	app.post('/admin/:name/item/:id/delete', item.delete); // bodyParser not working when using DELETE method

	app.get('/logs/:limit', admin.log);
}
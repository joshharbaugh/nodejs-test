var ProfessionProvider = require('./professionprovider-mongodb').ProfessionProvider
  , request = require('request');

var ProfessionProvider = new ProfessionProvider('localhost', 27017);

exports.index = function(req, res) {
	ProfessionProvider.findAll(function(err, professions) {
		res.render('admin/profession/index', { title: '', professions: professions, bootstrap: JSON.stringify(professions) });
	});
}

exports.show = function(req, res) {
	res.render('admin/profession/create', { title: '', items: [] });
}

exports.create = function(req, res) {
	var b = req.body;
	b.items = [];
	
	ProfessionProvider.create(b._id, b, function(err, resp) {
		if ( err ) throw err;
		res.redirect('/admin/professions');	
	});
}

exports.read = function(req, res) {
	ProfessionProvider.findById(req.params.id, function(err, profession) {
		res.render('admin/profession/show', { title: '', profession: profession, bootstrap: JSON.stringify(profession) });
	});
}

exports.update = function(req, res) {
	var b = req.body;
	b.items = [];
	console.log(b);

	ProfessionProvider.update(req.params.id, b, function(err, resp) {
		if ( err ) throw err;
		res.redirect('/admin/professions');	
	});
}

exports.delete = function(req, res) {
	var b = req.body;

	ProfessionProvider.destroy(b._id, function(err, resp) {
		if ( err ) throw err;
		else {
			console.log(resp);
			res.redirect('/admin/professions');	
		}
	});
}
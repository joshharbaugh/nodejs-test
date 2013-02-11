var kue = require('kue');

var jobs = kue.createQueue();

function create() {
	var name = ['test1', 'test2', 'test3'][Math.random() * 4 | 0];
	jobs.create('email', {
		title: 'Emailing ' + name + '',
		body: 'hello'
	}).save();
	setTimeout(create, Math.random() * 1000 | 0);
}

create();

jobs.process('email', 1, function(job, done) {
	console.log('email');
	setTimeout(done, Math.random() * 2000);
});

kue.app.listen(3001);
console.log('UI started on port 3001');
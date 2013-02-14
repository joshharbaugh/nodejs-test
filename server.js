var cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , app     = require('./app');

if ( cluster.isMaster ) {
    // fork workers
    for (var i=0; i < 2; ++i) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // server init

    require('./queue')(app);

    app.listen(3000, function() {
        console.log('Server running on port 3000');
    });
}
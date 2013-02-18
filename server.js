var cluster = require('cluster')
  , cpus    = require('os').cpus().length
  , app     = require('./app');

/*if ( cluster.isMaster ) {

    cluster.fork();
    
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

} else {*/
    
    // server init
    app.listen(3000, function() {
        console.log('Server running on port 3000');
    });

//}
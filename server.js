var cluster = require('cluster')
  , app     = require('./app');

/*if ( cluster.isMaster ) {

    cluster.fork();
    
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

} else {

}*/
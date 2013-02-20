requirejs.config({
    appDir: '../',
    baseUrl: '../modules',
    paths: {
        'angular': '../js/lib/angular',
        'bootstrap': '../js/lib/bootstrap',
        'gritter': '../js/lib/gritter',
        'tuj': '../js/lib/tuj',
        'taffy': '../js/vendor/taffy'
    },
    shim: {
        'lib/angular': {
            exports: 'angular'
        },
        'main/app': {
            deps: ['angular', 'bootstrap', 'gritter', 'tuj', 'taffy'],
            exports: 'app'
        },
        'main/controllers': {
            deps: ['main/app']
        },
        'main/directives': {
            deps: ['main/app']
        },
        'main/services': {
            deps: ['main/app']
        }
    }
})

require(["angular", "bootstrap", "gritter", "tuj", "taffy", "main/app", "main/controllers", "main/directives", "main/services"], function(app) {

    // everything's loaded. awesome-sauce.
    angular.bootstrap(document, ['app']);
    console.log('Rock \'n\' roll!');

});
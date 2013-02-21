requirejs.config({
    appDir: '../',
    baseUrl: '../modules',
    dir: '../build',
    optimize: 'uglifyjs',
    paths: {
        'modules': '../js/modules',
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
        },
        'realm/controllers': {
            deps: ['main/app', 'main/services']
        }
    }
});

require(["angular", "modules", "bootstrap", "gritter", "tuj", "taffy", "main/app", "main/controllers", "main/directives", "main/services", "realm/controllers"], function() {

    /*
     * bootstrap our app
     */
    angular.bootstrap(document, ['app']);

});
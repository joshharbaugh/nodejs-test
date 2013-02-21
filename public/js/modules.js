(function($, window) {
    var dependencies = {};
    var app = window.app || {};
    app.require = function(module, dep) {
        if( typeof dep == 'undefined' ) {
            if( typeof dependencies[module] == 'undefined' ) {
                dependencies[module] = [];
            }
            return dependencies[module];
        } else {
            console.log(dep)
            if( $.isArray(dep) ) {
                for( var i=0; i < dep.length; i++ ) {
                    app.require(module, dep[i]);
                }
            } else {
                var requirements = app.require(module);
                var found = dep == module;
                for( var i=0; i < requirements.length && !found; i++ ) {
                    if( requirements[i] == dep )
                        found = true;
                }
                if( !found ) {
                    app.require(module).push(dep);
                }
            }
            return app;
        }
    };


    window.app = app;
})(jQuery, window);
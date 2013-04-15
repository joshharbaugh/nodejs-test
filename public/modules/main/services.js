app.service('store', [function() {
    var stores = {};

    function getStore(store) {
        if( typeof stores[store] == 'undefined' ) {
            stores[store] = {};
        }
        return stores[store];
    }

    function getTable(store, table) {
        var db = getStore(store);
        if( typeof db[table] == 'undefined' ) {
            db[table] = TAFFY();
        }
        return db[table];
    }

    var service = {
        insert:function(store, table, obj) {
            var db = getTable(store, table);
            db.insert(obj);
        },
        get:function(store, table) {
            var db = getTable(store, table);
            return db().order('priority').get();
        },
        remove:function(store, table, obj) {
            var db = getTable(store, table);
            db(obj).remove();
        },
        getService:function(store) {
            return {
                register:function(table, obj) {
                    service.insert(store, table, obj);
                },
                getRegistered:function(table) {
                    return service.get(store, table);
                }
            }
        }
    };
    return service;
}]);

app.service('blocks', ['store', function(store) {
    return store.getService('blocks');
}]);

app.service('pages', ['blocks','navigation', function(blocks, navigation) {
    var pages = TAFFY([]);

    var service = {
        /**
         * Registers a page
         *
         * @method register
         * @for pages
         * @param {String} url
         * @param {String} title
         * @param {Array} params
         */
        register:function(url, title, params) {
            var copy = jQuery.extend({}, params);
            copy.url = url;
            copy.title = title;
            pages.insert(copy);

            var oldShow = typeof copy.onShow != 'undefined' ? copy.onShow : function() {};
            var onShow = function(scope) {
                scope.contentModule = title;
                oldShow.apply(this, arguments);
            };
            copy.onShow = onShow;

            var oldHide = typeof copy.onHide != 'undefined' ? copy.onHide : function() {};
            var onHide = function(scope) {
                scope.contentModule = '';
                oldHide.apply(this, arguments);
            };
            copy.onHide = onHide;

            blocks.register('main', copy);
        }
    };
    return service;
}]);

app.service('partials', ['$http','$q','$timeout', function($http, $q, $timeout) {
    var loaded = {};

    var service = {
        /**
         * Ajax loads a partial using a promise.
         * 
         * @method load
         * @for partials
         * @param {String} url
         * @param {Boolean} force
         */
        load : function(url, force) {
            var modularMatch = url.match(/\s*\(\s*([\\\-\.\w]+)\s*,\s*([\\\-\.\w]+)\s*\)\s*/);
            if( modularMatch ) {
                url = '/modules/'+modularMatch[1]+'/partials/'+modularMatch[2]+'.html';
            }
            var deferred = null;
            if( typeof loaded[url] == 'undefined' || force ) {
                deferred = $q.defer();
                loaded[url] = {loading:true,deferred:deferred};
                $http({method:'GET',url:url})
                    .success(function(data) {
                        loaded[url].loading = false;
                        loaded[url].success = true;
                        loaded[url].result = data;
                        deferred.resolve(data);

                        // Only hold on to partials for a few minutes
                        // we don't want our cache to be too big
                        $timeout(function() {
                            console && console.log && console.log('Removing ', url, ' from partials cache');
                            delete(loaded[url]);
                        }, 300000); 
                    })
                    .error(function(data,status,headers,config) {
                        // reset the cache so we can try to load it again later
                        delete loaded[url]; 

                        deferred.reject(status);
                    });
            } else {
                if( loaded[url].loading ) {
                    deferred = loaded[url].deferred;
                } else {
                    deferred = $q.defer();
                    $timeout(function() {
                        if( loaded[url].success ) {
                            deferred.resolve(loaded[url].result);
                        } else {
                            deferred.reject(loaded[url].result);
                        }
                    });
                }
            }
            return deferred.promise;
        }
    };
    return service;
}]);

app.service('routing', ['$rootScope', '$location', '$timeout', function($rootScope, $location, $timeout) {

    var current = null;
    $rootScope.$watch(
        function() { 
            return $location.url();
        },
        function() {
            processUrl($location.url());
        }
    );

    function processUrl(url) {
        // TODO
        var split = url.split('?');
        if( split[0][split[0].length-1] != '/' ) {
            split[0] += '/';
        }
        var path = split.shift();
        var query = '';
        while( split.length > 0 ) {
            var piece = split.shift();
            if( piece.length > 0 ) {
                if( query.length > 0 ) {
                    query += '&';
                }
                query += piece;
            }
        }
        url = path + (query.length > 0 ? '?'+query : '');
        if( url != current ) {
            current = url;

            // Process the query parameters
            var params = {};
            var querySplit = query.split('&');
            while( querySplit.length > 0 ) {
                var queryPiece = querySplit.shift();
                if( jQuery.trim(queryPiece).length == 0 ) continue;
                var queryPieceSplit = queryPiece.split('=');
                var name = queryPieceSplit[0];
                var value = queryPieceSplit.length > 0 ? queryPieceSplit.join('=') : null;
                params[name] = value;
            }

            for( var i=0; i < registrants.length; i++ ) {
                var match = url.match(registrants[i].pattern);
                if( match && match[0] == url ) {
                    try {
                        registrants[i].callback.call(registrants[i], path, params);
                    } catch(e) {
                        console && console.error && console.error('URL Listener Error:', e.message);
                        console && console.error && console.error('Listener: ', registrants[i]);
                    }
                }
            }
        }
    }

    var registrants = [];
    var routingService = {
        register:function(obj) {
            if( angular.isFunction(obj) ) {
                routingService.register({pattern:/.*/,callback:obj});
                return;
            }
            if( angular.isArray(obj) ) {
                for( var i=0; i < obj.length; i++ ) {
                    routingService.register(obj[i]);
                }
                return;
            }
            if( typeof obj.pattern == 'undefined' || typeof obj.callback == 'undefined' ) {
                for( var pattern in obj ) {
                    if( typeof pattern.match != 'undefined' && angular.isFunction(obj[pattern]) ) {
                        routingService.register({pattern:new RegExp(pattern),callback:obj[pattern]});
                    }
                }
                return;
            }

            if( angular.isFunction(obj.callback) ) {
                registrants.push(obj);
            }
        },
        set: function(url) {
            function attempt() {
                $location.url(url);
            }
            $timeout(attempt);
        },
        get: function() {
            return $location.url();            
        }
    }
    return routingService;

}]);
app.run(['routing', function(routing) {}]);

app.service('locale', ['$rootScope', '$timeout', function($rootScope, $timeout) {

    /* default */
    var current = 'en_US';
    if(!$rootScope.locale) {
        $rootScope.locale = current;
    }
    
    var localeService = {
        set: function(locale) {
            $timeout(function() {
                $rootScope.locale = locale;
            });
        },
        get: function() {
            return $rootScope.locale;
        }
    }
    return localeService;

}]);
app.run(['locale', function(locale) {}]);

app.service('navigation', ['routing', function(routing) {
    var items = [];
    var nav = {
        /**
         * Return an array of navigation items
         *
         * @method register
         * @for navigation
         * @namespace sl.navigation
         * @param {Array} item
         */
        register:function(item) {
            if( angular.isArray(item) ) {
                for( var i=0; i < item.length; i++ ) {
                    nav.register(item[i]);
                }
                return;
            }

            if( typeof item.match != 'undefined' ) {
                item = {label:item};
            }

            // Make a copy so it doesn't change behind our back
            item = jQuery.extend({}, item);

            if( typeof item.label == 'undefined' ) {
                if( typeof item.url == 'undefined' ) {
                    return;
                }
                item.label = item.url;
            }
            items.push(item);
        }
    };
    return nav;
}]);
// Initialize the navigation service
app.run(['navigation', function(navigation) {}]);
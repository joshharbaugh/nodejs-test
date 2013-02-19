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
    }

    var routingService = {
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
app.run(['routing',function(routing) {}]);
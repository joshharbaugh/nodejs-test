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
        console.log('URL: ', url);
    }

}]);
app.run(['routing',function(routing) {}]);
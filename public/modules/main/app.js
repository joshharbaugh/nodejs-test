var app = angular.module('app', []).config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/realm/:id', {
        templateUrl: '/modules/realm/partials/show.html'
    })
    .when('/about', {
        templateUrl: '/modules/about/partials/show.html'
    })
    .when('/contact', {
        templateUrl: '/modules/contact/partials/show.html'
    })
	.otherwise({
        redirectTo: '/'
	});

    $locationProvider.html5Mode(false).hashPrefix('!');
}]);
'use strict';

/* App Module */

var app = angular.module('app', []).
	config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
		$routeProvider
		.when('/realm/:id', {
			templateUrl: '/partials/realm_show.html'
        })
        .when('/about', {
            templateUrl: '/partials/about_show.html'
        })
        .when('/contact', {
            templateUrl: '/partials/contact_show.html'
        })
		.otherwise({
			redirectTo: '/'
		});

        $locationProvider.html5Mode(false).hashPrefix('!');
}]);
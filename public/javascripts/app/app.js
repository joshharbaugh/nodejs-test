'use strict';

/* App Module */

var app = angular.module('app', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/realm/:id', {
			templateUrl: 'partials/realm_show.html'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
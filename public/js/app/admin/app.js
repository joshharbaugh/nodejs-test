'use strict';

/* Admin App Module */

var app = angular.module('app', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'AppCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
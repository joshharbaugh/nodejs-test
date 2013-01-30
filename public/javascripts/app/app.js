'use strict';

/* App Module */

var app = angular.module('app', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'AppCtrl'
		})
		.when('/realm/:id', {
			controller: 'RealmCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
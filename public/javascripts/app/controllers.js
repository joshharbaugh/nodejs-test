'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope', function($scope) {

	var realms = window.realms || {};

}]);

app.controller('RealmCtrl', ['$scope', function($scope) {

	var realm       = window.realm    || {};
	var professions = window.professions || {};

	try {
	
		$scope.professions = professions || {};

		console.log('Professions', $scope.professions);

	} catch(e) {

		console.error(e);

	}

}]);
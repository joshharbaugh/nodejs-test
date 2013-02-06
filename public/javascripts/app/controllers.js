'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope', function($scope) {

	var realms     = $scope.realms     = window.realms     || {};
	var profession = $scope.profession = window.profession || {};

}]);

app.controller('RealmCtrl', ['$scope', function($scope) {

	var realm          = $scope.realm          = window.realm          || {};
	var professions    = $scope.professions    = window.professions    || {};
	var professionCost = $scope.professionCost = window.professionCost || {};

	try {

		console.log('Professions', professions);

	} catch(e) {

		console.error(e);

	}

}]);
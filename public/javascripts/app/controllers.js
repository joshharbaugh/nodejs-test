'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope', function($scope) {

	var realms = window.realms || {};

}]);

app.controller('RealmCtrl', ['$scope', function($scope) {

	var realm       = window.realm    || {};
	var auctions    = window.auctions || {};
	var professions = window.professions || {};

	try {

		$scope.allianceAuctions = auctions.alliance.auctions || {};
		$scope.hordeAuctions    = auctions.horde.auctions    || {};
		$scope.neutralAuctions  = auctions.neutral.auctions  || {};
		$scope.professions      = professions                || {};

	} catch(e) {}

}]);
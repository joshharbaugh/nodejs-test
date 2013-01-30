'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope', function($scope) {

	var realms = window.realms || {};
	
	angular.forEach(realms, function(realm) {

		console.log(realm.name);

	});

}]);

app.controller('RealmCtrl', ['$scope', function($scope) {

	var realm    = window.realm || {};
	var auctions = window.auctions || {};

	console.log(auctions);

	$scope.allianceAuctions = auctions.alliance.auctions;
	$scope.hordeAuctions    = auctions.horde.auctions;
	$scope.neutralAuctions  = auctions.neutral.auctions;

	angular.forEach($scope.neutralAuctions, function(auction, index) {

		console.log('\n[NEUTRAL]------------------------------------------\n');

		for (var key in auction) {

			if(auction.hasOwnProperty) {

				console.log(key, auction[key]);

			}
		
		}

	});

}]);
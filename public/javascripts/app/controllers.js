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
	var auctions       = $scope.auctions       = window.auctions       || {};

	try {

		$scope.costToLevel = [];

		for(var key in professionCost) {
			
			console.log('\n------------------------------------------------\n');

			var ctlA = 0,
			    ctlH = 0;
			
			if(professionCost.hasOwnProperty(key)) {
				var items = professionCost[key].items;
				console.log(items);
				for(var k in items) {
					if(items.hasOwnProperty(k)) {
						var tCostA = items[k].realmCost.alliance * professions[key].items[k].qty;
						var tCostH = items[k].realmCost.horde * professions[key].items[k].qty;
						ctlA += tCostA;
						ctlH += tCostH;
					}
				}
			}

			professionCost[key].alliance = ctlA;
			professionCost[key].horde = ctlH;

			console.log(professionCost[key]._id+' alliance cost: ', professionCost[key].alliance);
			console.log(professionCost[key]._id+' horde cost: ', professionCost[key].horde);

		}

	} catch(e) {

		console.error(e);

	}

}]);
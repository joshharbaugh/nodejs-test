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

		for(var key in professionCost) {
			
			console.log('\n------------------------------------------------\n');

			var ctlA = 0,
			    ctlH = 0;

			var itemCostAlliance, itemCostHorde;
			
			if(professionCost.hasOwnProperty(key)) {
				var items = professionCost[key].items;
				for(var k in items) {
					if(items.hasOwnProperty(k)) {

						var auctionsAlliance = auctions.alliance;						
						for(var i in auctionsAlliance) {
							if(auctionsAlliance.hasOwnProperty(i)) {
								if(items[k]._id == auctionsAlliance[i]._id) {
									itemCostAlliance = auctionsAlliance[i].realmCost;
									items[k].realmCost.alliance = itemCostAlliance;
								}
							}
						}
						var tCostA = itemCostAlliance * professions[key].items[k].qty;

						var auctionsHorde = auctions.horde;
						for(var i in auctionsHorde) {
							if(auctionsHorde.hasOwnProperty(i)) {
								if(items[k]._id == auctionsHorde[i]._id) {
									itemCostHorde = auctionsHorde[i].realmCost;
									items[k].realmCost.horde = itemCostHorde;
								}
							}
						}
						var tCostH = itemCostHorde * professions[key].items[k].qty;

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
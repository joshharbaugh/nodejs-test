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

		$scope.costToLevel = [];

		for(var key in professionCost) {
			
			console.log('\n------------------------------------------------\n');

			var ctl = 0;
			
			if(professionCost.hasOwnProperty(key)) {
				var items = professionCost[key].items;
				for(var k in items) {
					if(items.hasOwnProperty(k)) {
						var tCost = items[k].realmCost * professions[key].items[k].qty;
						ctl += tCost;
					}
				}
			}

			professionCost[key].alliance = ctl;
			professionCost[key].horde = ctl;

			console.log(professionCost[key]._id+' alliance cost: ', professionCost[key].alliance);
			console.log(professionCost[key]._id+' horde cost: ', professionCost[key].horde);

		}

	} catch(e) {

		console.error(e);

	}

}]);
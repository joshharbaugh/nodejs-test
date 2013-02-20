'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope','routing', function($scope, routing) {

	console.log('AppCtrl: ', routing.get());

	var realms     = $scope.realms     = window.realms     || {};
	var profession = $scope.profession = window.profession || {};

}]);

app.controller('NavCtrl', ['$scope','$element','$location','$timeout', function($scope, $element, $location, $timeout) {

	var nav = $element.find('ul')[0];

	$scope.location = $location;

	function checkUrl(navItem, dataTarget) {
		var navItem    = navItem    || null;
		var dataTarget = dataTarget || null;
		if(navItem && dataTarget) {
			if($location.path() == dataTarget) {
				$('.site-nav').children('li').removeClass('active');
				$(navItem).addClass('active');
			}
		}
	}

	angular.forEach(nav.children, function(navItem, i) {
		var dataTarget = $(navItem.children[0]).data('target');
		checkUrl(navItem, dataTarget);

		$(navItem).click(function() {
			$timeout(function() {
				checkUrl(navItem, dataTarget);
			});
		});
	});

}]);

app.controller('RealmCtrl', ['$scope','$routeParams','$http','routing', function($scope, $routeParams, $http, routing) {

	console.log('RealmCtrl: ', routing.get());
	
	var realmName = $routeParams.id || null;
	var realm, professions, professionCost, auctions;

	//var realm          = $scope.realm          = window.realm          || {};
	//var professions    = $scope.professions    = window.professions    || {};
	//var professionCost = $scope.professionCost = window.professionCost || {};
	//var auctions       = $scope.auctions       = window.auctions       || {};

	$http.get('/api/realm/' + realmName)
		.success(function(response) {

			realm = $scope.realm = response.realm;
			professions = $scope.professions = response.professions;
			professionCost = $scope.professionCost = response.professionCost;
			auctions = $scope.auctions = response.auctions;

			processRealm();

		})
		.error(function(data) {

			console.log('API endpoint error');
		
		});

	function processRealm() {

		try {

			for(var key in professionCost) {
				
				//console.log('\n------------------------------------------------\n');

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
										if (itemCostAlliance == 0) {
											itemCostAlliance = professions[key].items[k].globalCost;
										}
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
										if (itemCostHorde == 0) {
											itemCostHorde = professions[key].items[k].globalCost;
										}
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
				professionCost[key].horde    = ctlH;

				//console.log(professionCost[key]._id+' alliance cost: ', professionCost[key].alliance);
				//console.log(professionCost[key]._id+' horde cost: ', professionCost[key].horde);

			}

		} catch(e) {

			console.error(e);

		}

	}

}]);
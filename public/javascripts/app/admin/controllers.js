'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope','$element', function($scope, $element) {

	try {
		
		var realms     = $scope.realms     = window.realms     || {};
		var profession = $scope.profession = window.profession || {};
		var items      = $scope.items      = window.profession.items || [];

	} catch(e) {}

	$scope.addItem = function() {

		var itemId  = $scope.itemId  = $('#itemId')[0].value;
		var itemQty = $scope.itemQty = $('#itemQty')[0].value;
		var itemGlobalCost = $scope.itemGlobalCost = $('#itemGlobalCost')[0].value;

		items.push({"_id":itemId, "qty":itemQty, "globalCost":itemGlobalCost});

	}

	$scope.removeItem = function(id) {

		for(var key in items) {
			if(items.hasOwnProperty(key)) {
				if(id === items[key]._id) {
					var index = items.indexOf(items[key]);
					items.splice(index, 1);
				}
			}
		}

	}

}]);
'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope','$element','$http','$timeout', function($scope, $element, $http, $timeout) {

	try {
		
		var realms     = $scope.realms     = window.realms     || {};
		var profession = $scope.profession = window.profession || {};
		var items      = $scope.items      = window.profession.items || [];
		
		/*
		 * Bootstrap global prices with
		 * TheUndermineJournal.com
		 *
		 */

		(function() {
			var self = setInterval(function() {
				var prices  = window.TUJ_DATA;
				if (prices) {
					clearInterval(self);
					$scope.$broadcast('prices_loaded', {data: prices});
				}
			}, 500);
		})();

		$scope.$on('prices_loaded', function(event, args) {		
			$scope.prices = args.data;

			if(!$scope.$$phase) {
				$scope.$apply();
			}
		});

	} catch(e) {}

	$scope.addItem = function() {

		var itemId  = $('#itemId')[0].value;
		var itemQty = $('#itemQty')[0].value;

		$http.post('/admin/' + profession._id + '/item/create', {"_id":itemId, "qty":itemQty}).success(function(data) {
			if (data) {
				items.push({"_id":data._id, "qty":data.qty, "globalCost":data.globalCost});
				$('#itemId')[0].value = '';
				$('#itemQty')[0].value = '';
			}
		});

	}

	$scope.updateItem = function(item, price) {

		console.log(item, price);

		item.globalCost = price;

		$http.put('/admin/' + profession._id + '/item/' + item._id, item).success(function(data) {

			console.log(data);

		});

	}

	$scope.editItem = function(item) {

		console.log('editing', item);

	}

	$scope.removeItem = function(item) {

		for(var key in items) {
			if(items.hasOwnProperty(key)) {
				if(item._id === items[key]._id) {
					var index = items.indexOf(items[key]);

					console.log(item);

					$http.post('/admin/' + profession._id + '/item/' + item._id + '/delete', item).success(function(data) {
						if(data == 'success') {

							console.log(item._id + ' removed successfully from PROFESSIONS and REALMS collections');

							items.splice(index, 1);

						}
					}).error(function(data) {

						console.log(data);

					});
				}
			}
		}

	}

}]);
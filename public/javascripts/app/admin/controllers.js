'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope','$element','$http', function($scope, $element, $http) {

	try {
		
		var realms     = $scope.realms     = window.realms     || {};
		var profession = $scope.profession = window.profession || {};
		var items      = $scope.items      = window.profession.items || [];

	} catch(e) {}

	$scope.addItem = function() {

		var itemId  = $('#itemId')[0].value;
		var itemQty = $('#itemQty')[0].value;

		$http.post('/admin/profession/' + profession._id, {"_id":itemId, "qty":itemQty}).success(function(data) {
			items.push({"_id":data._id, "qty":data.qty, "globalCost":data.globalCost});
			$('#itemId')[0].value = '';
			$('#itemQty')[0].value = '';

			$http.post('/admin/realms/' + profession._id, {"_id":data._id, "qty":data.qty, "globalCost":data.globalCost}).success(function(data) {
				console.log('response', data);
			});

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

					/*$http.delete('/admin/' + profession._id + '/deleteItem', {method: 'DELETE', data: item}).success(function(data) {
						if(data == "success") {

							console.log(item._id + ' removed successfully from professions collection.');

							$http.delete('/admin/' + profession._id + '/item/' + item._id, {method: 'DELETE'}).success(function(data) {
								if(data == 'success') {

									console.log(item._id + ' removed successfully from realms collection.');

									items.splice(index, 1);

								}
							}).error(function(data) {

								console.log(data);

							});

						}
					}).error(function(data) {
						alert('Unable to remove item. Please try again.');
					});*/
				}
			}
		}

	}

}]);
'use strict';

/* Controllers */

app.controller('AppCtrl', ['$scope','routing', function($scope, routing) {

	var realms     = $scope.realms     = window.realms     || {};
	var profession = $scope.profession = window.profession || {};

	routing.register(function(url) {
		if( url == '' || url == '/' ) {
			routing.set('/');
		}
	});

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
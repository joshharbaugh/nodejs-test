'use strict';

/* Services */

app.directive('priceTag', ['$scope', function($scope) {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			console.log(element);

			var re=/(\d*?)(\d{0,2}?)(\d{1,2})$/;

			element.toString().replace(re, TheUndermineJournal.gsc);

		}
	}

}]);
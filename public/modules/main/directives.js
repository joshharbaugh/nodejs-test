app.directive('wpPriceTag', ['$compile','$timeout', function($compile,$timeout) {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var re=/(\d*?)(\d{0,2}?)(\d{1,2})$/;

			$timeout(function() {
				var expr = attrs.wpPriceTag;
				var price = null;
				if(expr != '') {
					if (typeof scope.$eval(expr) != 'undefined') {
						// using an expression
						price = scope.$eval(expr);
					} else {
						// using a string
						price = expr;
					}

					scope.$watch(expr, function(newVal) {
						element.text(newVal.toString().replace(re, TheUndermineJournal.gsc));
					});
				}
			});
			
		}
	}

}]);
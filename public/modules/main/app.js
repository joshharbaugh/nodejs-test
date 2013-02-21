var app = angular.module('app', []).config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/realm/:id', {
        templateUrl: '/modules/realm/partials/show.html'
    });

    //$locationProvider.html5Mode(false).hashPrefix('!');
}]);
app.run(['pages', function(pages) {
    pages.register('/about', 'About', {partial:'(about,show)'});
    pages.register('/contact', 'Contact', {partial:'(contact,show)'});
}]);
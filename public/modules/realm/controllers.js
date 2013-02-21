'use strict';

/* Controllers */

var RealmCtrl = function($scope, $http, routing) {

    var realmName = routing.get().split('/').pop();
    var realm, professions, professionCost, auctions;

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

            }

        } catch(e) {

            console.error(e);

        }

    }

}
RealmCtrl.$inject = ['$scope', '$http', 'routing'];
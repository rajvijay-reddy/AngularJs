angular.module('NinjaAppCtrl',['NinjaAppServices'])

.controller('NinjaCtrl',['$scope','$location','$http','NinjaService',
  function($scope,$location, $http, NinjaService) {

    // $http({
    //   method: 'get',
    //   url: 'data/ninja.json'
    // }).then(function(response) {
    //     // groceryService.groceryItems = JSON.parse(JSON.stringify(response));
    //     $scope.ninjas = response.data;
    // }, function(error){
    //   console.log(error, 'cannot get data');
    // });

$scope.ninjas = NinjaService.ninjas;
  $scope.addNinja = function() {
    $scope.ninjas.push({
      name: $scope.newName,
      belt:$scope.newBelt,
      rate:parseInt($scope.newRate),
      available: true
    });
    console.log(angular.toJson($scope.ninjas));
    $location.path('/directory');
  };

  $scope.removeNinja = function(ninja) {
    var removedNinja = $scope.ninjas.indexOf(ninja);
    $scope.ninjas.splice(removedNinja, 1);
  };

  $scope.$watch(function() {return $scope.ninjas;},
    function(ninjas) {
      $scope.ninjas = ninjas;
    });
}])

.controller('ContactController', ['$scope', '$location',
  function($scope, $location) {
    $scope.sendMessage = function() {
      $location.path('/contact-success');
    };
}])
;

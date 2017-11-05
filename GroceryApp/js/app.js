/**
* Created by Thomas on 5/28/2015.
*/
var app = angular.module('GroceryListApp', ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: "views/grocerylist.html",
    controller: "HomeController"
  })
  .when('/additem', {
    templateUrl: "views/additem.html",
    controller: "GroceryListItemController"
  })
  .when('/additem/edit/:id/', {
    templateUrl: "views/additem.html",
    controller: "GroceryListItemController"
  })
  .otherwise({
    redirectTo: "/"
  });
});

//angular.element(document.body).injector().get("GroceryService").findById(4)
app.factory('GroceryService', function($http) {

  var groceryService = {};
  // groceryService.groceryItems = [];
  $http({
    method: 'get',
    url: 'data/server_data.json'
  }).then(function(response) {
      // groceryService.groceryItems = JSON.parse(JSON.stringify(response));
      groceryService.groceryItems = response.data;
      for(var item in groceryService.groceryItems ) {
        groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date);
      }
  }, function(error){
    console.log(error, 'cannot get data');
  });

  groceryService.save = function(entry) {
      var updatedItem = groceryService.findById(entry.id);
      if(updatedItem) {
        updatedItem.completed = entry.completed;
        updatedItem.itemName = entry.itemName;
        updatedItem.date = entry.date;
      } else {

        entry.id = groceryService.getNewId();
        // $http.post({
        //   method: "post",
        //   url: "data/added_item.json",
        //   data: entry
        // }).then(function(data){
        //   entry.id = data.newId;
        // },function(error){
        //   console.log(error, 'cannot post data');
        // });
        groceryService.groceryItems.push(entry);
      }

    };

    groceryService.getNewId = function() {
      return groceryService.groceryItems.length;
    };

    groceryService.findById = function(id) {
      for(var item in groceryService.groceryItems) {
        if(groceryService.groceryItems[item].id === id) {
          return groceryService.groceryItems[item];
        }
      }
    };

    groceryService.removeItem = function(entry) {
      var index = groceryService.groceryItems.indexOf(entry);
      groceryService.groceryItems.splice(index,1);
    };

    groceryService.markCompleted = function(entry) {
      entry.completed = !entry.completed;
    };

    return groceryService;
  });

  app.controller('HomeController',['$scope','GroceryService', function($scope, GroceryService) {
    $scope.groceryService = GroceryService;
    $scope.appTitle = "Grocery List";
    $scope.groceryItems = $scope.groceryService.groceryItems ;

    $scope.removeItem =  function(item) {
      $scope.groceryService.removeItem(item);
    };

    $scope.markCompleted = function(item) {
      $scope.groceryService.markCompleted(item);
    };

    $scope.$watch(function() {return $scope.groceryService.groceryItems;},
      function(groceryItems) {
        $scope.groceryItems = groceryItems;
      });
  }]);

  app.controller('GroceryListItemController',['$scope', '$routeParams',
  'GroceryService','$location',function($scope, $routeParams, GroceryService,
    $location) {
      $scope.groceryService = GroceryService;

      if(!$routeParams.id) {
        $scope.groceryItem = {
          id:0,
          completed:false,
          itemName: "",
          date: new Date()
        };
      } else {
        $scope.groceryItem = $scope.groceryService.findById(parseInt($routeParams.id));
      }

      $scope.save = function() {
        $scope.groceryService.save($scope.groceryItem);
        $location.path('/');
      };

      console.log($scope.groceryItems);
    }]);

    app.directive('tbGroceryItem', function() {
      return {
        restrict: 'E',
        templateUrl: "views/groceryitem.html"
      };
    });

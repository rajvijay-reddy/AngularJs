var myNinjaApp = angular.module('NinjaApp',['ngRoute',
'NinjaAppCtrl','NinjaAppDirective']);

myNinjaApp.config(['$routeProvider','$locationProvider',
function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/home',{
    templateUrl: "views/home.html",
    controller: "NinjaCtrl"
  })
  .when('/directory', {
    templateUrl: "views/ninjalist.html",
    controller: "NinjaCtrl"
  })
  .when('/addninja', {
    templateUrl: "views/addninja.html",
    controller: "NinjaCtrl"
  })
  .when('/contact', {
    templateUrl: "views/contact.html",
    controller: 'ContactController'
  })
  .when('/contact-success', {
    templateUrl: "views/contact-success.html",
    controller: 'ContactController'
  })

  .otherwise({
    redirectTo: "/home"
  });
}]);

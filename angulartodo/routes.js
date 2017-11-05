angular.module('todo', ['ui.router'])
.config(['$urlRouterProvider', '$stateProvider',
  function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  })
  .state('list', {
    url: '/list/:title',
    templateUrl: 'list/list.html',
    controller: 'listCtrl'
  });
}]);

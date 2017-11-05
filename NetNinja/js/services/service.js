angular.module('NinjaAppServices',[])
.factory('NinjaService', function($http) {
  var ninjaService = {};


  $http({
    method: 'get',
    url: 'data/ninja.json'
  }).then(function(response) {
      ninjaService.ninjas = response.data;
      console.log('ninjaService.ninjas########', ninjaService.ninjas);
  }, function(error){
    console.log(error, 'cannot get data');
  });
  return ninjaService;
});

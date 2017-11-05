angular.module('eventModuleCtrl',['eventModuleService'])

.controller('EventController',['$scope','TalkService' ,
  function($scope, TalkService){
  $scope.appTitle = "Talks";
  $scope.talkService = TalkService;

  TalkService.getTalks().then(function(talks) {
    $scope.talks = talks;
  }, function() {
    console.log("Error while fetching data");
  });
}]);

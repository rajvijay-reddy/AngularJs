angular.module('eventModuleService',[])

.factory('TalkService', function($http) {

  var talkService = {};
  talkService.getTalks = function() {
    $http.get('data/talks.json')
    .then(function(response) {
      return talk = response.data;

    },
     function(error){
      console.log(error, 'cannot get data');
    });
  };

  return talkService;
});

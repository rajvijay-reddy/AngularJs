(function() {
  angular.module('turtleFacts')
        .factory('dataService', ['$http',function($http) {
          var dataObj = {
            correctAnswers: [1,2,3,0,2,0,3,2,0,3],
            getAvailableTurtles: function() {
              return $http.get("turtles.json");
            },
            getAvailableQuizes: function() {
              return $http.get("quizQuestions.json");
            }
          };

          return dataObj;

        }]);
})();

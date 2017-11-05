(function() {

  angular.module('turtleFacts')
        .controller('quizCtrl', ['$scope', 'quizMetrics', 'dataService',
            function($scope, quizMetrics, dataService) {
          $scope.quizMetrics = quizMetrics;
          $scope.dataService = dataService;
          $scope.questions = [];
          $scope.activeQuestion = 0;
          $scope.error = false;
          $scope.finalise = false;

          var numQuestionsAnswered = 0;

          dataService.getAvailableQuizes().then(function(response) {
            $scope.questions = response.data;
          });

          $scope.setActiveQuestion = function(index){
            if(index === undefined) {
              var breakOut = false;
              var quizLength = $scope.questions.length - 1;

              while(!breakOut){
                 $scope.activeQuestion = $scope.activeQuestion < quizLength ?
                    ++$scope.activeQuestion : 0;

                    if($scope.activeQuestion === 0) {
                      $scope.error = true;
                    }

                if($scope.questions[$scope.activeQuestion].selected === null){
                  breakOut = true;
                }
              }
            } else {
              $scope.activeQuestion = index;
            }

        };

          $scope.questionAnswered = function() {
            var quizLength = $scope.questions.length;
            numQuestionsAnswered = 0;
              for(var x=0; x< quizLength; x++) {
            if($scope.questions[$scope.activeQuestion].selected !== null){
              numQuestionsAnswered++;
              if(numQuestionsAnswered >= quizLength){
              for(var i=0; i< quizLength; i++) {
                  if($scope.questions[i].selected === null ) {
                    setActiveQuestion(i);
                    return;
                  }

                }
                $scope.error = false;
                $scope.finalise = true;
                return;
              }
            }
          }
            $scope.setActiveQuestion();
          };

          $scope.selectAnswer = function(index) {
            $scope.questions[$scope.activeQuestion].selected = index;
          };

          $scope.finaliseAnswers = function() {
            $scope.finalise = false;
            $scope.numQuestionsAnswered = 0;
            $scope.activeQuestion = 0;
            quizMetrics.markQuiz();
            quizMetrics.changeState("quiz", false);
            quizMetrics.changeState("results", true);

          };
        }]);
})();

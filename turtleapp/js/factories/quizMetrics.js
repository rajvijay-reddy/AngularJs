(function() {
  angular.module('turtleFacts')
        .factory('quizMetrics', 'dataService', function($http, dataService) {
          var questions = [];
          dataService.getQuizes().then(function(response) {
            questions = response.data;
          });

          var quizObj = {
            quizActive: false,
            resultsActive: false,
            correctAnswers : [],
            numCorrect: 0,
            changeState: function(metric, state) {
              if(metric ==="quiz") {
              quizObj.quizActive = state;
            } else if(metric ==="results") {
              quizObj.resultsActive = state;
            } else {
              return false;
            }
          },


          markQuiz: function() {
            quizObj.correctAnswers= dataService.correctAnswers;
            for(var i = 0; i < questions.length; i++){
                if(questions[i].selected === dataService.correctAnswers[i]){
                    questions[i].correct = true;
                    quizObj.numCorrect++;
                }else{
                    questions[i].correct = false;
                }
            }
          }
          };

          return quizObj;

        });
})();

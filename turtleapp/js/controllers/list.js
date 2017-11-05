(function() {
  angular.module('turtleFacts')
    .controller("listCtrl", listController);

    listController.$inject = ['quizMetrics', 'dataService', '$http'];
    function listController(quizMetrics, dataService, $http) {
      var vm = this;
      vm.dummyData = "hello world";
      vm.activeTurtle = {};
      vm.search="";
      vm.quizMetrics = quizMetrics;
      vm.dataService = dataService;
      vm.turtlesData= [];

      vm.changeActiveTurtle = function(index) {
        vm.activeTurtle = index;
      };

      vm.activateQuiz = function() {
        quizMetrics.changeState("quiz", true);
      };

      dataService.getAvailableTurtles().then(function(response) {
        vm.turtlesData = response.data;
      });

      // $http.get("../../turtles.json").success(function(data) {
      //
      //   vm.turtlesData = data;
      //   console.log(vm.turtlesData);
      // });
  }
})();

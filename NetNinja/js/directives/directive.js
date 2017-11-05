angular.module('NinjaAppDirective',[])

.directive('randomNinja', function() {
  return {
    restrict: 'AE',
    scope: {
      ninj: '=',
      title: '='
    },
    templateUrl: 'views/random.html',
    transclude: true,
    replace: true,
    controller: function($scope) {
      $scope.random = Math.floor(Math.random() * 4);
    }
  };
});

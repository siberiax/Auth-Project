var homeController = angular.module("homeController", []);

homeController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.name = JSON.parse($window.localStorage.getItem('user')).name;
  $scope.username = JSON.parse($window.localStorage.getItem('user')).username;

}]);

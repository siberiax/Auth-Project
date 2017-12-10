var followersController = angular.module("followersController", []);

followersController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.username = $window.location.href.substring(32);
  $scope.followers = "";
  $scope.hasFollowers = null;
  $scope.message = "";

  var req = {
    method: 'POST',
    url: 'http://localhost:3000/getFollowers',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {username: $scope.username}
  }
  $http(req).then(function(res){
    $scope.followers = res.data.users;
    $scope.hasFollowers = true;
    $scope.numFollowers = ($scope.followers).length;
    if ($scope.numFollowers == 0) {
      $scope.hasFollowers = false;
      $scope.message = "Go find yourself some Followers!";
    }
  });
}]);

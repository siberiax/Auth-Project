var followingController = angular.module("followingController", []);

followingController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.username = $window.location.href.substring(32);
  $scope.following = "";

  var req = {
    method: 'POST',
    url: 'http://localhost:3000/getFollowing',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {username: $scope.username}
  }
  $http(req).then(function(res){
    $scope.following = res.data.users;
    $scope.numFollowing = ($scope.following).length;
    console.log(res.data.users);
  });
}]);

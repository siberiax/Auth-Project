var profileController = angular.module("profileController", []);

profileController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  console.log($window.location.href.substring(30));

  $scope.userExists = null;
  $scope.results = "";
  $scope.username = "";

  var req = {
   method: 'POST',
   url: 'http://localhost:3000/getUser',
   headers: {
     'Content-Type': 'application/json'
   },
   data: {username: $window.location.href.substring(30)}
  }
  $http(req).then(function(res){
    console.log(res.data.success);
    if (res.data.success){
      $scope.userExists = true;
      $scope.username = $window.location.href.substring(30);
    } else {
      $scope.userExists = false;
    }
  });

  $scope.addPost = function() {
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/addPost',
     headers: {
       'Content-Type': 'application/json'
     },
     data: {post: $scope.post, username: $scope.username}
    }
    $http(req).then(function(res){
      $scope.result = res.data.msg;
    });
  };
}]);

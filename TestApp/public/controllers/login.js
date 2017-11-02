var loginController = angular.module("loginController", []);

loginController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.loginUser = function() {
    console.log($scope.user);
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/users/authenticate',
     headers: {
       'Content-Type': 'application/json'
     },
     data: $scope.user
    }
    $http(req).then(function(res){
      if (!res.data.success){
        console.log("problem");
      } else {
        $window.location.href = '/2fa'
        };
      })
    }
}])

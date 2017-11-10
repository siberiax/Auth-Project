var loginController = angular.module("loginController", []);

loginController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.loginUser = function() {
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/authenticate',
     headers: {
       'Content-Type': 'application/json'
     },
     data: $scope.user
    }

    $http(req).then(function(res){
      if (!res.data.success){
        console.log("problem");
      } else {
        $window.localStorage.setItem('user', JSON.stringify(res.data.user));
        $window.location.href = '/2fa';
        };
      })
    }
}])

var loginController = angular.module("loginController", []);

loginController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.loginUser = function() {
    console.log($scope.user);
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
        console.log(res);
        //$window.localStorage.setItem('id_token', res.data.token);
        //$window.localStorage.setItem('user', JSON.stringify(res.data.user));
        //$window.localStorage.setItem('fromLogin', 'true');
        $window.location.href = '/2fa'
        };
      })
    }
}])

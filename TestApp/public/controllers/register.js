var registerController = angular.module("registerController", []);
registerController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.addUser = function() {
    console.log($scope.user);
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/register',
     headers: {
       'Content-Type': 'application/json'
     },
     data: $scope.user
    }
    $http(req).then(function(res){
      if (!res.data.success){
        console.log("problem");
      } else {
        $window.localStorage.setItem('fromRegister', 'true');
        $window.localStorage.setItem('user', JSON.stringify($scope.user));
        $window.location.href = '/twoFactorSetup'
        };
      })
  }
}])

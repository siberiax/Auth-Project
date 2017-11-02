var registerController = angular.module("registerController", []);
registerController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.addUser = function() {
    console.log($scope.user);
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/users/register',
     headers: {
       'Content-Type': 'application/json'
     },
     data: $scope.user
    }
    $http(req).then(function(res){
      if (!res.data.success){
        console.log("problem");
      } else {
        $window.location.href = '/twoFactorSetup'
        };
      })
  }
}])

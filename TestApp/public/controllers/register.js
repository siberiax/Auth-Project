var registerController = angular.module("registerController", []);
registerController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.failure = "";

  $scope.addUser = function() {
    if ($scope.user.password != $scope.password2){
      $scope.failure = "Passwords don't match";
    } else {
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
          if (res.data.msg == 'bad email'){
            $scope.failure = "Please enter a valid email";
          } else {
            $scope.failure = "Failure with Registration";
          }
        } else {
          $window.localStorage.setItem('fromRegister', 'true');
          $window.localStorage.setItem('user', JSON.stringify($scope.user));
          $window.location.href = '/twoFactorSetup'
          };
        })
    }
  }
}])

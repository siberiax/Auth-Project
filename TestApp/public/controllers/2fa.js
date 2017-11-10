var twoSetupVerification = angular.module("twoSetupVerification", []);
twoSetupVerification.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.failure = "";

  $scope.verify = function(otp){
    console.log(otp);
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/twoFactorVerifyLogin',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {otp: $scope.otp, username: JSON.parse($window.localStorage.getItem('user')).username}
    }
    $http(req).then(function(res) {
      console.log(res.data.success)
      if(res.data.success) {
        $window.location.href = '/profile';
      } else {
        $scope.failure = "Wrong OTP";
      }
    })
  }
}]);

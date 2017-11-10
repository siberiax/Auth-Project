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
      if(res.data.success) {
        console.log(res);
        $window.location.href = '/profile';
      } else {
        console.log(res);
        $scope.failure = "Wrong OTP";
      }
    })
  }
}]);

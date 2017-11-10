var twoSetupController = angular.module("twoSetupController", []);
twoSetupController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.allowed = false;

  $scope.result = "";

  if ($window.localStorage.getItem('fromRegister') == 'true'){
    console.log('all good')
    $scope.allowed = true;
    $window.localStorage.removeItem('fromRegister');
  } else {
    $window.location.href = '/register'
  }

  $scope.qrcode = ""

  var user = $window.localStorage.getItem('user')
  console.log(user);
  $scope.onClick = function() {
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/twoFactorSetup',
      headers: {
       'Content-Type': 'application/json'
      },
      data: user
    }
    $http(req).then(function(res){
      $scope.qrcode = res.data.dataURL;
    })
  }

  $scope.confirmOTP = function(otp) {
    $scope.otp = otp;
    console.log($scope.otp);
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/twoFactorVerify',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {otp: $scope.otp, username: JSON.parse($window.localStorage.getItem('user')).username}
      }
      $http(req).then(function(res) {
        console.log(res);
        if(res.data.success) {
          $scope.result = "Success! You can login now";
        }
        else {
          $scope.result = "Incorrect OTP";
        }
      })
    }
}]);

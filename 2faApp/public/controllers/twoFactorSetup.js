var twoSetupController = angular.module("twoSetupController", []);
twoSetupController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.allowed = false;

  $scope.result = "";

  if ($window.localStorage.getItem('fromRegister') == 'true'){
    $scope.allowed = true;
  } else {
    $window.location.href = '/register'
  }

  $scope.qrcode = null;

  $scope.onClick = function() {
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/twoFactorSetup',
      headers: {
       'Content-Type': 'application/json'
      },
      data: JSON.parse($window.localStorage.getItem('user'))
    }
    $http(req).then(function(res){
      $scope.qrcode = res.data.dataURL;
    })
  }

  $scope.confirmOTP = function(otp) {
    $scope.otp = otp;
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/twoFactorVerify',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {otp: $scope.otp, username: JSON.parse($window.localStorage.getItem('user')).username}
      }
      $http(req).then(function(res) {
        if(res.data.success) {
          $window.localStorage.removeItem('fromRegister');
          $scope.result = "Success! You can login now";
        }
        else {
          $scope.result = "Incorrect OTP";
        }
      })
    }
}]);

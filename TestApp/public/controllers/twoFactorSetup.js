var twoSetupController = angular.module("twoSetupController", []);
twoSetupController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.allowed = false;

  if ($window.localStorage.getItem('fromRegister') == 'true'){
    console.log('all good')
    $scope.allowed = true;
    $window.localStorage.removeItem('fromRegister');
  } else {
    $window.location.href = '/register'
  }

  $scope.qrcode = ""
  $scope.user = ""

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
      console.log(res);
      $scope.qrcode = res.data.dataURL;
      $scope.display = true;
      $scope.username = res.data.username;
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
        data: {otp: $scope.otp, username: $scope.username}
      }
      $http(req).then(function(res) {
        if(!res.data.success) {
          console.log(res.data.msg);
        }
        else {
          console.log(res.data.msg);
        }
      })
  }
}])

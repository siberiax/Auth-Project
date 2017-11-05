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

  $scope.onClick = function() {
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/twoFactorSetup'
    }
    $http(req).then(function(res){
      console.log(res);
      $scope.qrcode = res.data.dataURL;
      //console.log(qrcode);
      })
  }
}])

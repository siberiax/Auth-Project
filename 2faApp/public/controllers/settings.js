var settingsController = angular.module("settingsController", []);
settingsController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.name = JSON.parse($window.localStorage.getItem('user')).name;
  $scope.username = JSON.parse($window.localStorage.getItem('user')).username;

  $scope.message = "";

  $scope.changeName = function(){
    console.log($scope.newName);
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/changeName',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {name: $scope.newName, username: JSON.parse($window.localStorage.getItem('user')).username}
    }
    $http(req).then(function(res){
      $scope.message = res.data.msg;
      if (res.data.success){
        var user = JSON.parse($window.localStorage.getItem('user'))
        user.name = $scope.newName;
        $window.localStorage.setItem('user', JSON.stringify(user));
        $scope.name = $scope.newName;
        $scope.message = "Name successfully changed";
      }
    })
  }

  $scope.changeEmail = function(){
    console.log($scope.newEmail);
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/changeEmail',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {email: $scope.newEmail, username: JSON.parse($window.localStorage.getItem('user')).username}
    }
    $http(req).then(function(res){
      $scope.message = res.data.msg;
      if (res.data.success){
        var user = JSON.parse($window.localStorage.getItem('user'))
        user.email = $scope.newEmail;
        $window.localStorage.setItem('user', JSON.stringify(user));
        $scope.message = "Email successfully changed";
      }
    })
  }

  $scope.changePassword = function(){
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/changePassword',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {oldpass: $scope.oldPassword, password: $scope.newPassword, username: JSON.parse($window.localStorage.getItem('user')).username}
    }
    $http(req).then(function(res){
      $scope.message = res.data.msg;
    });
  };
}]);

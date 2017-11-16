var searchController = angular.module("searchController", []);

searchController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.name = JSON.parse($window.localStorage.getItem('user')).name;
  $scope.username = JSON.parse($window.localStorage.getItem('user')).username;
  $scope.users = "";
  $scope.message = ""
  $scope.userExists = null;

  $scope.userSearch = function() {
    console.log($scope.searchName);
    var req = {
      method: 'POST',
      url: 'http://localhost:3000/userSearch',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {searchName: $scope.searchName, username: JSON.parse($window.localStorage.getItem('user')).username}
    }
    $http(req).then(function(res) {
      if (res.data.success) {
        console.log(res.data.users);
        $scope.userExists = true;
        $scope.users = res.data.users;
        if (($scope.users).length == 0) {
          $scope.message = "No Users Found"
          $scope.userExists = false;
        }
      }
    })
  }
}]);

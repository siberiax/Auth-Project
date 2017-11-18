var homeController = angular.module("homeController", []);

homeController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.name = JSON.parse($window.localStorage.getItem('user')).name;
  $scope.username = JSON.parse($window.localStorage.getItem('user')).username;

  $scope.message = null;

  $scope.posts = []

  var req = {
    method: 'POST',
    url: 'http://localhost:3000/getFollowing',
    headers: {
     'Content-Type': 'application/json'
    },
    data: {username: $scope.username}
  }
  $http(req).then(function(res){
    var users = res.data.users
    var i = 0
    if (users.length == 0){
      $scope.message = "You should follow some people to see their posts"
    }
    while (i < users.length){
      var user = users[i].following;
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/getPosts',
        headers: {
         'Content-Type': 'application/json'
        },
        data: {username: user}
      }
      $http(req).then(function(res){
        var posts = res.data.posts;

        var j = 0;
        while (j < posts.length){
          $scope.posts.push(res.data.posts[j]);
          j++;
        }
      })
      i++;
    }
    // $scope.posts.sort(function(a, b) {
    //   return a.id - b.id;
    // });
    //$scope.posts.reverse();
  })
}]);

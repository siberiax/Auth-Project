var profileController = angular.module("profileController", []);

profileController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.userExists = null;
  $scope.results = "";
  $scope.username = "";
  $scope.email = "";
  $scope.posts = null;
  $scope.following = null;

  var req = {
   method: 'POST',
   url: 'http://localhost:3000/getUser',
   headers: {
     'Content-Type': 'application/json'
   },
   data: {username: $window.location.href.substring(30)}
  }
  $http(req).then(function(res){
    if (res.data.success){
      $scope.userExists = true;
      $scope.username = $window.location.href.substring(30);
      $scope.email = res.data.user.email;
      var sameUser = $window.location.href.substring(30) == JSON.parse($window.localStorage.getItem('user')).username;
      $scope.sameUser = sameUser;
      var req = {
       method: 'POST',
       url: 'http://localhost:3000/getPosts',
       headers: {
         'Content-Type': 'application/json'
       },
       data: {username: $scope.username}
      }
      $http(req).then(function(res){
        $scope.posts = res.data.posts;
        if (!$scope.sameUser){
          var req = {
           method: 'POST',
           url: 'http://localhost:3000/getFollow',
           headers: {
             'Content-Type': 'application/json'
           },
           data: {username: JSON.parse($window.localStorage.getItem('user')).username, following: $scope.username}
          }
          $http(req).then(function(res){
            $scope.following = res.data.following
          });
        }
      });
    } else {
      $scope.userExists = false;
    }
  });

  $scope.addPost = function() {
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/addPost',
     headers: {
       'Content-Type': 'application/json'
     },
     data: {post: $scope.post, username: $scope.username}
    }
    $http(req).then(function(res){
      $scope.result = res.data.msg;
    });
  };

  $scope.followUnfollow = function() {
    if (!$scope.following){
      var req = {
       method: 'POST',
       url: 'http://localhost:3000/follow',
       headers: {
         'Content-Type': 'application/json'
       },
       data: {username: JSON.parse($window.localStorage.getItem('user')).username, following: $scope.username}
      }
      $http(req).then(function(res){
        if (res.data.success){
          $scope.following = true;
        }
      });
    }  else {
      var req = {
       method: 'POST',
       url: 'http://localhost:3000/unfollow',
       headers: {
         'Content-Type': 'application/json'
       },
       data: {username: JSON.parse($window.localStorage.getItem('user')).username, unfollow: $scope.username}
      }
      $http(req).then(function(res){
        if (res.data.success){
          $scope.following = false;
        }
      });
    }
  }


}]);

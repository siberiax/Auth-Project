var profileController = angular.module("profileController", []);

profileController.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.userExists = null;
  $scope.results = "";
  $scope.username = "";
  $scope.email = "";
  $scope.name = "";
  $scope.posts = null;
  $scope.following = null;
  $scope.numFollowing = null;

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
      $scope.name = res.data.user.name;
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
        $scope.posts = (res.data.posts).reverse();
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
    var timeString = ""
    var d = new Date().toString().split(" ")
    timeString += d[1] + " " + d[2] + " " + d[3] + " "
    var t = d[4].split(":")
    var hour = parseInt(t)%12
    timeString += hour + ":" + t[1]
    if (t[0] > 11){
      timeString += " pm"
    } else {
      timeString += " am"
    }
    var req = {
     method: 'POST',
     url: 'http://localhost:3000/addPost',
     headers: {
       'Content-Type': 'application/json'
     },
     data: {post: $scope.post, username: $scope.username, time: timeString}
    }
    console.log(req);
    $http(req).then(function(res){
      $window.location.href = '/profile/' + $scope.username
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

  $scope.username = $window.location.href.substring(30);
  $scope.following = "";
  $scope.followers = "";

  var req = {
    method: 'POST',
    url: 'http://localhost:3000/getFollowing',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {username: $scope.username}
  }
  $http(req).then(function(res){
    $scope.following = res.data.users;
    $scope.numFollowing = ($scope.following).length;
    console.log(res.data.users);
  });

  $scope.getFollowing = function() {
    $http(req).then(function(res){
      $window.location.href = '/following/' + $scope.username
    });

  }

  var req = {
    method: 'POST',
    url: 'http://localhost:3000/getFollowers',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {username: $scope.username}
  }
  $http(req).then(function(res){
    $scope.followers = res.data.users;
    $scope.numFollowers = ($scope.followers).length;
  });

  $scope.getFollowers = function() {
    $http(req).then(function(res){
      $window.location.href = '/followers/' + $scope.username
    });
  }
}]);

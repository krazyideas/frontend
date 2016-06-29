var app = angular.module('myApp', []);
app.controller('loginCtrl', function($window, $scope, $http) {
    $http.get('/config/enabledProviders').then(function(res) {
        $scope.enableGithub = res.data.github;
        $scope.enableGoogle = res.data.google;
        $scope.enableLinkedIn = res.data.linkedIn;
        $scope.enableFacebook = res.data.facebook;
    });
    $scope.login = function(path) {
        console.log("redirect");
        $window.location.href = '/auth' + path;
    }
});

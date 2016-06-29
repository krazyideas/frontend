var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $http.get('/config/enabledProviders').then(function(res) {
        $scope.enableGithub = res.data.github;
        $scope.enableGoogle = res.data.google;
        $scope.enableLinkedIn = res.data.linkedIn;
        $scope.enableFacebook = res.data.facebook;
    });
});

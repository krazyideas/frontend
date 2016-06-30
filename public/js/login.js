var app = angular.module('ui.bootstrap.modal');

app.controller('loginCtrl', function ($scope, $uibModal, $log, $http, $window) {

    $scope.loggedIn = false;

    $http.get('/config/enabledProviders').then(function(res) {
        console.log(res.data);
        $scope.enabled = res.data;
    });

    $http.get("/me").then(function successCallback(res) {
        $scope.loggedIn = true;
    }, function errorCallback(res) {
        $scope.loggedIn = false;
    });

    $scope.login = function(path) {
        console.log("redirect");
        $window.location.href = '/auth' + path;
    };

    $scope.openAuthDialog = function (size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            scope: $scope,
            size: size
        });
    };

    $scope.logout = function () {
        $window.location.href = '/auth/logout';
    };

});

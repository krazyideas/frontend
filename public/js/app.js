var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap']);

app.controller('myCtrl', function($scope, $http) {
    $http.get("/ideas").then(function(response) {
        $scope.ideas = response.data;
    });
});

app.controller('authCtrl', function($scope, $http) {
    $scope.testLDAP = function () {
        var login = "vustinov";
        var password = "12345x";

        $http({
            method: 'POST',
            url: '/auth/ldap',
            data: {
                "login": login,
                "password": password
            }
        }).then(function successCallback(response) {
            alert("SUCCESS" + response.toSource());
        }, function errorCallback(response) {
            alert("ERROR: " + response.toSource());
        });
    };
});

app.controller('voteCtrl', function($scope, $window, $http) {
    $scope.myFunction = function(ideaHref) {
        console.log("ideaHref: " + ideaHref);
        $http({
                method: 'POST',
                url: '/vote',
                headers: {
                    'Content-Type': "application/json"
                },
                data: { "idea" : ideaHref }
            }
        ).then(function successCallback(response) {
            console.log("response.status: " + response.status);
            console.log("data: " + JSON.stringify(response.data));
            $scope.idea.voteCount++;
        }, function errorCallback(response) {
            console.log("response.status: " + response.status);
            console.log("data: " + JSON.stringify(response.data));
        });

    }
});

app.directive('tabMe', function() {
    return {
        restrict: 'A',
        templateUrl: 'pages/me.html'
    };
});

app.directive('tabRank', function() {
    return {
        restrict: 'A',
        templateUrl: 'pages/rank.html'
    };
});

app.directive('tabIdea', function() {
    return {
        restrict: 'A',
        templateUrl: 'pages/idea.html'
    };
});
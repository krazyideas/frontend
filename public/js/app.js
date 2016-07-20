var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap', 'ngSanitize', 'textAngular']);

app.controller('ideasCtrl', function($scope, $http) {
    var votedIdeas = {};
    $http.get("/ideas").then(function(response) {
        $scope.ideas = response.data;
        $http.get("/me/voteHistory").then(function(response1) {
            votedIdeas = response1.data;
            if(votedIdeas.length != 0) {
                $scope.ideas.forEach(function(idea) {
                    idea["voted"] = false;
                    votedIdeas.forEach(function(votedIdea){
                        if(idea._links.self.href === votedIdea._links.self.href) {
                            idea.voted = true;
                        }
                    });
                });
            }
        });
    });
    $scope.currentPage = 1;
    $scope.maxsize = 5;
    $scope.itemsPerPage = 5;
    $scope.propertyName = 'voteCount';
    $scope.reverse = true;
    $scope.pageIdeas = function() {
        if (!$scope.ideas) {
            return null;
        } else {
            var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
            return $scope.ideas.slice(start, start + $scope.itemsPerPage);
        }
    }
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    }
});

app.controller('authCtrl', function($scope, $http, $window) {
    $scope.testLDAP = function () {
        $http({
            method: 'POST',
            url: '/auth/ldap',
            data: {
                "login": $scope.ldapName,
                "password": $scope.ldapPass
            }
        }).then(function successCallback(response) {
            console.log(response);
            if (response.status == 200 && response.data.status == 'ok') {
                $window.location.reload();
            } else {
                alert("Status: " + response.status + ", Data: " + response.data);
            }
        }, function errorCallback(response) {
            alert("Status: " + response.status + ", Data: " + response.data);
        });
    };
});

app.controller('voteCtrl', function($scope, $window, $http) {
    $scope.getVoteClass = function() {
        if($scope.idea.voted) {
            return 'btn btn-danger btn-sm'
        }
        return 'btn btn-primary btn-sm'
    }
    $scope.getVoteText = function() {
        if($scope.idea.voted) {
            return "unvote"
        }
        return "vote"
    }
    var vote = function(ideaHref) {
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
            $scope.idea.voted = true;
        }, function errorCallback(response) {
            console.log("response.status: " + response.status);
            console.log("data: " + JSON.stringify(response.data));
        });
    }
    var unvote = function(ideaId) {
        $http({
                method: 'DELETE',
                url: '/vote',
                headers: {
                    'Content-Type': "application/json"
                },
                data: { "ideaId" : ideaId }
            }
        ).then(function successCallback(response) {
            console.log("response.status: " + response.status);
            console.log("data: " + JSON.stringify(response.data));
            $scope.idea.voteCount--;
            $scope.idea.voted = false;
        }, function errorCallback(response) {
            console.log("response.status: " + response.status);
            console.log("data: " + JSON.stringify(response.data));
        });
    }
    $scope.voteOrUnvote = function() {
        if($scope.idea.voted) {
            unvote($scope.idea.id);
        } else {
            vote($scope.idea._links.self.href);
        }
    }
});

app.controller('tabCtrl', function($scope, $window, $http) {

    var idea = null;

    $scope.goToIdeaTab = function(ideaHref) {
        console.log("tabsCtrl ideaHref: " + ideaHref);
        $scope.tabIndex = 2;
        idea = ideaHref;
    };

    $scope.tabIdeaFunc = function() {
        if (idea!=null) {
            $http({
                    method: 'POST',
                    url: '/ideas',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    data: { "idea" : idea }
                }
            ).then(function successCallback(response) {
                console.log("response.status: " + response.status);
                console.log("data: " + JSON.stringify(response.data));
                $scope.selectedIdea = response.data;
            }, function errorCallback(response) {
                console.log("response.status: " + response.status);
                console.log("data: " + JSON.stringify(response.data));
            });
        }

    };

    $scope.tabMeFunc = function() {
        if ($scope.me == null) {
            $http({
                    method: 'GET',
                    url: '/me'
                }
            ).then(function successCallback(response) {
                console.log("response.status: " + response.status);
                console.log("data: " + JSON.stringify(response.data));
                $scope.me = response.data;
            }, function errorCallback(response) {
                console.log("response.status: " + response.status);
                //console.log("data: " + JSON.stringify(response.data));
            });
        }
        $http({
            method: 'GET',
            url: '/me/voteHistory'
            }
        ).then(function successCallback(response) {
            console.log("votedIdeas response.status: " + response.status);
            console.log("votedIdeas data: " + JSON.stringify(response.data));
            $scope.votedIdeas = response.data;
        }, function errorCallback(response) {
            console.log("votedIdeas response.status: " + response.status);
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

app.controller('ideaUpdater', function ($scope, $http) {

    $scope.submitIdea = function (idea, resultVarName)
    {
        var body = {
            "href": idea._links.self.href,
            "data": {
                "name": idea.name,
                "description": idea.description,
                "shortDescription": idea.shortDescription,
                "html": idea.html
            }
        };

        $http.post("/ideas/update", body)
            .success(function (data, status, headers, config) {
                alert("Result: "+data);
            })
            .error(function (data, status, headers, config) {
                alert("Error: "+data);
            });
    };

});

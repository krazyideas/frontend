var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
    console.log("req.isAuthenticated()" + req.isAuthenticated());

    if (req.isAuthenticated()) {
        var person = req.user.href;
        console.log("person: " + person);

        var options = {
            uri: person,
            method: 'GET'
        };

        request(options, function (error, response, body) {
            console.log("sc: " + response.statusCode)
            console.log("body: " + JSON.stringify(body))
            res.statusCode = response.statusCode;
            res.send(body);
        });
    } else {
        res.statusCode = 401;
        res.end();
    }


});

router.get('/voteHistory', function(req, res, next) {
    console.log("req.isAuthenticated()" + req.isAuthenticated());

    if (req.isAuthenticated()) {
        var voteUrl = req.user.href + "/votes";
        console.log("votes: " + voteUrl);

        var options = {
            uri: voteUrl,
            method: 'GET'
        };

        request(options, function(error, response, body) {
            console.log("sc: " + response.statusCode)
            console.log("body: " + JSON.stringify(body))
            var links = JSON.parse(body)._embedded.vote;
            var votes = [];

            var getVoteHistory = function(i) {
                var vote = {};
                var options1 = {
                    uri: links[i]._links.idea.href,
                    method: 'GET'
                };
                request(options1, function(error1, response1, body1) {
                    console.log("body1: " + body1);
                    var body1Json = JSON.parse(body1);
                    vote = body1Json;
                    votes.push(vote);
                    i++;
                    if (i < links.length) {
                        getVoteHistory(i);
                    } else {
                        res.statusCode = response.statusCode;
                        console.log("votes data: " + votes);
                        res.send(votes);
                    }
                });
            };
            if(links.length != 0){
                getVoteHistory(0);
            } else {
                res.send([]);
            }
        });
    } else {
        res.statusCode = 401;
        res.end();
    }
});
module.exports = router;

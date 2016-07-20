var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../configAccess');

var voteUrl = "/vote";
var searchVoteUrl = "/vote/search/findByPersonIdAndIdeaId";

/* post vote. */
router.post('/', function(req, res, next) {
    console.log("url" + conf.backendUrl+voteUrl);
    console.log("body" + JSON.stringify(req.body));
    console.log("req.isAuthenticated()" + req.isAuthenticated());

    if (req.isAuthenticated()) {

      var idea = req.body.idea;
      var person = req.user.href;

      console.log("idea: " + idea);
      console.log("person: " + person);

      var options = {
        uri: conf.backendUrl+voteUrl,
        method: 'POST',
        json: {
          "idea" : idea,
          "person" : person
          }
      };

      request(options, function (error, response, body) {
        console.log("sc: " + response.statusCode)
        console.log("body: " + JSON.stringify(body))
        res.statusCode = response.statusCode;
        res.send(body);
      });
    } else {
      res.statusCode = 401;
      res.send("login before voting");
    }


});

/* delete vote. */
router.delete('/', function(req, res, next) {
    console.log("url" + conf.backendUrl+voteUrl);
    console.log("body" + JSON.stringify(req.body));
    console.log("req.isAuthenticated()" + req.isAuthenticated());

    if (req.isAuthenticated()) {

        var ideaId = req.body.ideaId;
        var personId = req.user.id;

         var options = {
           uri: conf.backendUrl + searchVoteUrl + "?personId=" + personId + "&ideaId=" + ideaId,
           method: 'GET'
         };

        console.log("uri: "+ conf.backendUrl + searchVoteUrl + "?personId=" + personId + "&ideaId=" + ideaId);
        /* get the vote of the user on the idea */
        request(options, function (error, response, body) {
            var voteHref = JSON.parse(body)._links.self.href;
            console.log("voteHref: " + voteHref);
            var options1 = {
                uri: voteHref,
                method: 'DELETE'
            }
            /* delete the vote */
            request(options1, function (error, response, body) {
                console.log("delete result: " + JSON.stringify(response));
                res.statusCode = response.statusCode;
                res.send(body);
            })
        });
    } else {
      res.statusCode = 401;
      res.send("login before voting");
    }

});

module.exports = router;

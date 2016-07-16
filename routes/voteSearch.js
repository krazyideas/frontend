var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../configAccess');

var voteSearchUrlPrefix = "/vote/search/";

/* search user / vote match. */
router.post('/', function(req, res, next) {
    if (req.isAuthenticated()) {

      var personId = req.body.personId;
      var ideaId = req.body.ideaId;

      voteSearchUrl = voteSearchUrlPrefix + 
                      'findByPersonIdAndIdeaId?personId=' +
                      personId + '&ideaId=' + ideaId

      var options = {
        uri: conf.backendUrl + voteSearchUrl,
        method: 'GET'
      };

      request(options, function (error, response, body) {
        res.statusCode = response.statusCode;
        res.send(body);
      });
    } else {
      res.statusCode = 401;
      res.send("login before searching");
    }
});

module.exports = router;

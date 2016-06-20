var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../conf/main');

var voteUrl = "/vote";

/* post vote. */
router.post('/', function(req, res, next) {
    console.log("url" + conf.backendUrl+voteUrl);
    console.log("body" + JSON.stringify(req.body));

    var options = {
      uri: conf.backendUrl+voteUrl,
      method: 'POST',
      json: req.body
    };

    request(options, function (error, response, body) {
      console.log("sc: " + response.statusCode)
      console.log("body: " + JSON.stringify(body))
      res.statusCode = response.statusCode;
      res.send(body);
    });

});

module.exports = router;

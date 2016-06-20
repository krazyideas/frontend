var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../conf/main');

var voteUrl = "/vote";

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

module.exports = router;

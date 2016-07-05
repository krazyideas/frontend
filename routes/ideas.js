var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../configAccess');

var ideasUrl = "/idea";

/* GET ideas listing. */
router.get('/', function(req, res, next) {
    request(conf.backendUrl+ideasUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyJson = JSON.parse(body);
            //var bodyEmbedded = bodyJson._embedded");
            //var ideasJsonArr = bodyEmbedded.ideas;
            res.send(bodyJson._embedded.idea);// Print the google web page.
        }
    })
});

router.post('/', function(req, res, next) {
    console.log("body" + JSON.stringify(req.body));
    var idea = req.body.idea;

    console.log("idea: " + idea);

    var options = {
        uri: idea,
        method: 'GET'
    };

    request(options, function (error, response, body) {
        console.log("sc: " + response.statusCode)
        console.log("body: " + JSON.stringify(body))
        res.statusCode = response.statusCode;
        res.send(body);
    });


});

router.post("/update", function (req, res, next) {

    var options = {
        uri: req.body.href,
        method: 'PUT',
        json: req.body.data
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send("SUCCESS");
        } else {
            res.send(error);
        }
    });
});

module.exports = router;

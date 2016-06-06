var express = require('express');
var router = express.Router();
var request = require('request');
var backendConf = require('../conf/backend');

var ideasUrl = "/idea";

/* GET ideas listing. */
router.get('/', function(req, res, next) {
    request(backendConf.backendUrl+ideasUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyJson = JSON.parse(body);
            //var bodyEmbedded = bodyJson._embedded");
            //var ideasJsonArr = bodyEmbedded.ideas;
            res.send(bodyJson._embedded.idea);// Print the google web page.
        }
    })
});

module.exports = router;

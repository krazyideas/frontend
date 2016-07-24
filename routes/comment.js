var express = require('express');
var router = express.Router();
var request = require('request');
var conf = require('../configAccess');

var ideasUrl = "/idea";

/* GET ideas listing. */
router.get('/', function(req, res, next) {
    var url = req.param("url");
    console.log("url: " + url);
    console.log("aaa: " + conf.backendUrl+ideasUrl)
    if (url.startsWith(conf.backendUrl+ideasUrl)) {
        request(url, function (error, response, body) {
            res.statusCode = response.statusCode;
            if (!error) {
                var bodyJson = JSON.parse(body);
                res.send(bodyJson._embedded.comment);
            } else {
                var bodyJson = JSON.parse(error);
                res.send(bodyJson);
            }
        })

    } else {
        console.log("wrong request with res: " + res);
    }

});

// TODO add comment
/*router.post('/', function(req, res, next) {
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


});*/

module.exports = router;

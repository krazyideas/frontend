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
        //res.send("login before voting");
    }


});

module.exports = router;
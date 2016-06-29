var express = require('express');
var router = express.Router();
var conf = require('../configAccess');

router.get('/enabledProviders', function(req, res, next) {
    res.send(conf.enabledProviders);
});

module.exports = router;

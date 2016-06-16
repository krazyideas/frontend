var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var GitHubStrategy = require('passport-github2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function(user, callback) {
    callback(null, user);
});

passport.deserializeUser(function(sessObj, callback) {
    callback(null, sessObj);
});

function authCallback(accessToken, refreshToken, profile, callback) {
    var userData = {
        authId: profile.id + "@" + profile.provider,
        name: profile.displayName ? profile.displayName : profile.username,
        email: profile.emails ? profile.emails.length ? profile.emails[0] : null : null
    };

    User.findOrCreate(userData, function (err, user) {
        return callback(err, user);
    });
}

var providers = require('../conf/auth-providers');
passport.use(new GitHubStrategy(providers.github, authCallback));
passport.use(new FacebookStrategy(providers.facebook, authCallback));

router.get('/github', passport.authenticate('github', {scope: ['user:email']}));
router.get('/facebook', passport.authenticate('facebook', {scope: ['read_stream']}));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login'}),
    function(req, res) {
        console.log('Github callback: SUCCESS');
        res.redirect('/');
    }
);

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login'}),
    function(req, res) {
        console.log('Facebook callback: SUCCESS');
        res.redirect('/');
    }
);

module.exports = router;

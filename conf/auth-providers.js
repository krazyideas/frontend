var mainConfig = require(__dirname + '/main');

var config = { };

config.github = {
    clientID: "521222867809e3daad92",
    clientSecret: "9714e077b94b8f0323302ecb4be835474e081e87",
    callbackURL: mainConfig.frontendUrl + "/auth/github/callback"
};

config.facebook = {
    clientID: "1210996198910644",
    clientSecret: "6a30fdeea9486fb4a36d917e95c09401",
    callbackURL: mainConfig.frontendUrl + "/auth/facebook/callback"
};

config.ldap = {
    usernameField: 'login',
    server: {
        url: 'ldap://172.17.0.2:389',
        bindDn: "cn=admin,dc=example,dc=org",
        bindCredentials: "admin",
        searchBase: "ou=users,o=example,dc=example,dc=org",
        searchFilter: "(uid={{username}})"
    }
};

module.exports = config;

var mainConfig = require('../conf/main');
var request = require('request');

function User(id, name, email, authId, href) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.authId = authId;
  this.href = href;
}

var API_URLS = {
    BY_ID:     '/people/search/findById?id=',
    BY_EMAIL:  '/people/search/findByEmail?email=',
    BY_AUTHID: '/people/search/findByAuthId?authId=',
    CREATE:    '/people'
};

User.findById = function (id, res) {
    searchPeople(API_URLS.BY_ID, id, res);
};

User.findByEmail = function (email, res) {
    searchPeople(API_URLS.BY_EMAIL, email, res);
};

User.findByAuthId = function (authId, res) {
    searchPeople(API_URLS.BY_AUTHID, authId, res);
};

User.findOrCreate = function (userData, callback) {
    searchPeople(API_URLS.BY_AUTHID, userData.authId, function (err, user) {
        if (err) {
            if (user.notFound) {
                createPerson(userData, function(err, newUser) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, newUser);
                    }
                });

            } else {
                callback(err, null);
            }
        } else {
            callback(null, user);
        }

    });
};

function searchPeople(api, arg, callback) {
    request(
        mainConfig.backendUrl + api + arg,
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                var bodyJson = JSON.parse(body);
                if (bodyJson._embedded.people.length > 0) {
                    var person = bodyJson._embedded.people[0];
                    var user = new User(
                        person.id,
                        person.name,
                        person.email,
                        person.authId,
                        person._links.self.href
                    );

                    callback(null, user);
                } else {
                    callback(new Error("Person is not found"), {notFound: true});
                }
            } else {
                callback(error, null);
            }
        }
    );
}

function createPerson(userData, callback) {
    var options = {
        method: 'post',
        body: userData,
        json: true,
        url: mainConfig.backendUrl + API_URLS.CREATE
    };

    request(options, function optionalCallback(err, httpResponse, body) {
        if (!err && httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
            var user = new User(
                body.id,
                userData.name,
                userData.email,
                userData.authId,
                userData.href = body._links.self.href
            );
            console.log("New user has been created:\n"+require("util").inspect(user));
            callback(null, user);
        }
        callback(err, null);

    });
}

module.exports = User;

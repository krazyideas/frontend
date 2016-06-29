var config = {};
config.backendUrl = "http://127.0.0.1:8080";
config.frontendUrl = "http://127.0.0.1:3000";
config.enabledProviders = {
    github: true,
    facebook: true,
    linkedIn: false,
    google: false
};

module.exports = config;

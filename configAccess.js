var fs = require('fs');
var content = fs.readFileSync('conf/config.json').toString();

module.exports = JSON.parse(content);

const fs = require('fs');
const path = require('path');

var contract = {
    baseUrl: "",
    services: {}
};

var files = fs.readdirSync(path.join(__dirname, 'services'));

for (var i = 0; i < files.length; i++) {
    var service = require(path.join(__dirname, 'services', files[i]));

    var serviceName = files[i].substring(0, files[i].indexOf('.'));
    contract.services[serviceName] = {};

    for (var item in service) {
        contract.services[serviceName][item] = {
            url: "/api/nca/" + serviceName + '/' + item
        };
    }
}

console.log(JSON.stringify(contract))
const fs = require('fs');
const path = require('path');

var contract = {
    baseUrl: "",
    services: {},
    count: 0
};

/**
 * Sets up the Service API calls based on services in your directory
 * @param serviceDirectory
 */
exports.setup = function (serviceDirectory) {
    var files = fs.readdirSync(serviceDirectory);

    for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf('.js') === -1) {
            continue;
        }

        var service = require(path.join(serviceDirectory, files[i]));
        contract.count++;

        var serviceName = files[i].substring(0, files[i].indexOf('.'));
        contract.services[serviceName] = {};

        for (var item in service) {
            if (typeof(service[item]) !== "function") {
                continue;
            }

            var args = getArgs(service[item]);

            contract.services[serviceName][item] = {
                service: serviceName,
                function: item,
                arguments: args,
                callback: service[item]
            };
        }
    }

    console.log("ServiceAPI listening (found " + contract.count + " services)");
};

/**
 * Returns the service contract to generate the client library
 * @param req
 * @param res
 * @returns {*}
 */
exports.contract = function (req, res) {
    return res.send(contract);
};

/**
 * Deals with requests from the client library
 * @param req
 * @param res
 * @returns {*}
 */
exports.request = function (req, res) {
    var serviceToCall = contract.services[req.body.service];
    if (!serviceToCall) {
        return res.status(404).send('NoService');
    }

    var functionToCall = serviceToCall[req.body.function];
    if (!functionToCall) {
        return res.status(404).send('NoFunction');
    }

    if (req.body.arguments.length !== functionToCall.arguments.length - 1) {
        return res.status(400).send('InvalidArguments');
    }

    if (req.body.arguments.length === 0) {
        functionToCall.callback(function () {
            res.send(arguments);
        });
    } else {
        req.body.arguments.push(function () {
            res.send(arguments);
        });

        functionToCall.callback.apply(null, req.body.arguments);
    }
};

function getArgs(func) {
    // First match everything inside the function argument parens.
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}
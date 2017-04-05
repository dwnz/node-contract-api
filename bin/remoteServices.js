const request = require('request');

function makeRequest(body, callback) {
    request.post(
        {
            method: 'post',
            body: body,
            json: true,
            url: "http://localhost:3000/api/nca"
        }
        ,
        function (err, response, body) {
            callback(body[0], body[1]);
        }
    );
};

var service = {
    contactService: {sendMessage: function (email, name, message, callback) {makeRequest({"service": "contactService","function": "sendMessage","arguments": [email, name, message]}, function (err, data) {callback(err,data);});},status: function (callback) {makeRequest({"service": "contactService","function": "status","arguments": []}, function (err, data) {callback(err,data);});},},exampleService: {HelloWorld: function (name, callback) {makeRequest({"service": "exampleService","function": "HelloWorld","arguments": [name]}, function (err, data) {callback(err,data);});},},
};

module.exports = service;
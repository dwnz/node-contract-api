var services = require('./remoteServices');

services.exampleService.HelloWorld("Daniel", function (err, data) {
    console.log( data);
});
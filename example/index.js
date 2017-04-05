const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

const serviceApi = require('../lib');
serviceApi.setup(path.join(__dirname, 'services'), app);

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/api/nca', serviceApi.request);
app.get('/api/nca/contract', serviceApi.contract);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
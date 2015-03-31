'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var swaggerize = require('swaggerize-express');

var apiapp = require('./apiapp.json');
var apidef = require('./apidef.json');

// complete apidef.json
if (process.env.WEBSITE_HOSTNAME) {
    apidef.host = process.env.WEBSITE_HOSTNAME;
}

// map apidef.json to apiapp.json
apiapp.version = apidef.info.version;
apiapp.author = apidef.info.contact.name;
apiapp.title = apidef.info.title;
apiapp.summary = apidef.info.description;

apiapp.license = {
    type: apidef.info.license.name,
    url: apidef.info.license.url
};

apiapp.links.push({
    text: apidef.info.contact.name,
    url: apidef.info.contact.url
});

var app = express();

app.use(morgan('combined'));

app.use(bodyParser.json({ type: '*/*' }));

app.use(swaggerize({
    api: apidef,
    docspath: apiapp.endpoints.apiDefinition,
    handlers: './handlers'
}));

app.get('/apiapp.json', function (req, res) {
    res.json(apiapp);
});

app.get('/', function (req, res) {
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('JavaScript Processor API App.');
});

app.listen(process.env.PORT || 1337);
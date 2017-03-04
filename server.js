const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const send = require('./libs/send');
const app = express();

app.use(morgan('dev'));

// Response static
app.use('/static', express.static('static'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/migration', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	require('./libs/migration').create(req.body, (e, attach) => e ? send.err(res, e) : send.ok(res, {noUsed : attach}));
});

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.listen(3001);
